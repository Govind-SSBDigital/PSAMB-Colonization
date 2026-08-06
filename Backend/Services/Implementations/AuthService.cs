using Backend.Data;
using Backend.Models.DTOs;
using Backend.Models.Entities;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<IdentityApplicationUser> _userManager;
        private readonly IConfiguration _config;
        private readonly ILogger<AuthService> _logger;
        private readonly ISendCredUserService _sendCredUserService;
        private readonly ApplicationDbContext _context;

        public AuthService(
            UserManager<IdentityApplicationUser> userManager,
            IConfiguration config,
            ILogger<AuthService> logger,
            ApplicationDbContext context,
            ISendCredUserService sendCredUserService)
        {
            _userManager = userManager;
            _config = config;
            _logger = logger;
            _context = context;
            _sendCredUserService = sendCredUserService;
        }

        public async Task<LoginResponse> RegisterAsync(RegisterRequest request)
        {
            var generatedPassword = GenerateUniquePassword();

            var existing = await _userManager.FindByEmailAsync(request.Email);
            if (existing != null)
                throw new ArgumentException("Email already registered");

            var existingMobile = await _context.ApplicationUsers
                .FirstOrDefaultAsync(x => x.MobileNo == request.MobileNo && x.IsDeleted == false);
            if (existingMobile != null)
                throw new ArgumentException("Mobile number already registered");

            var identityUser = new IdentityApplicationUser
            {
                UserName = request.Email.ToLower().Trim(),
                Email = request.Email.ToLower().Trim(),
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            var result = await _userManager.CreateAsync(identityUser, generatedPassword);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new ArgumentException(errors);
            }

            await _userManager.AddToRoleAsync(identityUser, "User");

            var applicant = new ApplicationUser
            {
                IdentityUserId = identityUser.Id,
                CategoryId = request.CategoryId,
                Gender = request.Gender,
                DateOfBirth = request.DateOfBirth,
                FirstName = request.FirstName,
                LastName = request.LastName,
                FatherHusbandFirstName = request.FatherHusbandFirstName,
                FatherHusbandLastName = request.FatherHusbandLastName,
                MotherFirstName = request.MotherFirstName,
                MotherLastName = request.MotherLastName,
                Email = request.Email.ToLower().Trim(),
                MobileNo = string.IsNullOrEmpty(request.MobileNo) ? null : request.MobileNo,
                IdentDocTypeId = request.IdentDocTypeId,
                IdentDocNumber = request.IdentDocNumber,
                PANNumber = request.PANNumber,
                IndividualStateId = request.IndividualStateId,
                IndividualDistrictId = request.IndividualDistrictId,
                IndividualCityId = request.IndividualCityId,
                IndividualPinCode = request.IndividualPinCode,
                IndividualPlotStreetLandmark = request.IndividualPlotStreetLandmark,
                AddrDocTypeId = request.AddrDocTypeId,
                AddrDocNumber = request.AddrDocNumber,
                FirmName = request.FirmName,
                GSTNumber = request.GSTNumber,
                MandiPropertyCode = request.MandiPropertyCode,
                IsSameAsIndividualAddress = request.IsSameAsIndividualAddress,
                BusinessStateId = request.BusinessStateId,
                BusinessDistrictId = request.BusinessDistrictId,
                BusinessCityId = request.BusinessCityId,
                BusinessPinCode = request.BusinessPinCode,
                BusinessPlotStreetLandmark = request.BusinessPlotStreetLandmark,
                IsActive = true,
                CreatedDate = DateTime.UtcNow
            };

            _context.ApplicationUsers.Add(applicant);
            await _context.SaveChangesAsync();

            var salt = Guid.NewGuid().ToString("N");
            var auth = new ApplicantAuth
            {
                ApplicantId = applicant.ApplicantId,
                Username = request.Email.ToLower().Trim(),
                PasswordHash = identityUser.PasswordHash ?? string.Empty,
                SaltKey = salt,
                FailedLoginAttempts = 0,
                IsLocked = false,
                CreatedDate = DateTime.UtcNow
            };

            _context.ApplicantAuths.Add(auth);
            await _context.SaveChangesAsync();
            await _sendCredUserService.SendCredentialsAsync(new SendCredModel
            {
                MobileNumber = request.MobileNo,
                EmailId = request.Email,
                Password = generatedPassword 
            });

            _logger.LogInformation("Applicant registered: {Email}", request.Email);

            return BuildLoginResponse(identityUser, applicant);
        }

        private string GenerateUniquePassword()
        {
            var upper = Guid.NewGuid().ToString("N").Substring(0, 4).ToUpper();
            var lower = Guid.NewGuid().ToString("N").Substring(0, 4).ToLower();
            var number = new Random().Next(10, 99).ToString();
            return $"Pss@{upper}{lower}{number}";
            // Example: Ps@A1B2c3d456
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            IdentityApplicationUser? identityUser = null;
            if (!request.IsHRMSOrUser)
            {
                identityUser = await _userManager.FindByEmailAsync(request.Email);
            }
            else
            {
                var applicantUser = await _context.ApplicationUsers.FirstOrDefaultAsync(x => x.Email == request.Email);
                if (applicantUser != null && !string.IsNullOrEmpty(applicantUser.IdentityUserId))
                {
                    identityUser = await _userManager.FindByIdAsync(applicantUser.IdentityUserId);
                }
            }
            if (identityUser == null)
                throw new UnauthorizedAccessException("Invalid email or password");

            if (!identityUser.IsActive)
                throw new UnauthorizedAccessException("Your account has been deactivated");

            var valid = await _userManager.CheckPasswordAsync(identityUser, request.Password);
            if (!valid)
                throw new UnauthorizedAccessException("Invalid email or password");

            ApplicationUser? applicant = await _context.ApplicationUsers
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(x => x.IdentityUserId == identityUser.Id);

            if (applicant == null)
            {
                _logger.LogWarning("Applicant not found by IdentityUserId {UserId}. Falling back to email lookup for {Email}.", identityUser.Id, identityUser.Email);

                applicant = await _context.ApplicationUsers
                    .IgnoreQueryFilters()
                    .FirstOrDefaultAsync(x => x.Email == identityUser.Email);

                if (applicant != null)
                    _logger.LogInformation("Applicant found by email for {Email} with IdentityUserId {ApplicantIdentityId}.", identityUser.Email, applicant.IdentityUserId);
            }

            if (applicant == null)
            {
                _logger.LogError("Applicant lookup failed for IdentityUserId {UserId} and Email {Email}. ConnectionString: {Conn}", identityUser.Id, identityUser.Email, _context.Database.GetDbConnection().ConnectionString);
                throw new KeyNotFoundException($"Applicant not found for user id {identityUser.Id} or email {identityUser.Email}");
            }

            _logger.LogInformation("User logged in: {Email}", request.Email);
            return BuildLoginResponse(identityUser, applicant);
        }

        public async Task<UserResponse> GetProfileAsync(string userId)
        {
            var identityUser = await _userManager.FindByIdAsync(userId)
                ?? throw new KeyNotFoundException("User not found");

            var applicant = await _context.ApplicationUsers
                .FirstOrDefaultAsync(x => x.Email == identityUser.Email)
                ?? throw new KeyNotFoundException("Applicant not found");

            return MapToResponse(identityUser, applicant);
        }
        public async Task<UserResponse> UpdateProfileAsync(string userId, UpdateProfileRequest request)
        {
            var identityUser = await _userManager.FindByIdAsync(userId)
                ?? throw new KeyNotFoundException("User not found");

            var applicant = await _context.ApplicationUsers
                .FirstOrDefaultAsync(x => x.Email == identityUser.Email)
                ?? throw new KeyNotFoundException("Applicant not found");

            applicant.FirstName = request.FullName.Trim();
            applicant.MobileNo = request.PhoneNumber ?? applicant.MobileNo;

            _context.ApplicationUsers.Update(applicant);
            await _context.SaveChangesAsync();  

            _logger.LogInformation("Profile updated: {UserId}", userId);
            return MapToResponse(identityUser, applicant);
        }

        public async Task ChangePasswordAsync(string userId, ChangePasswordRequest request)
        {
            if (request.NewPassword != request.ConfirmNewPassword)
                throw new ArgumentException("New passwords do not match");

            var user = await _userManager.FindByIdAsync(userId)
                ?? throw new KeyNotFoundException("User not found");

            var result = await _userManager.ChangePasswordAsync(
                user, request.CurrentPassword, request.NewPassword);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new ArgumentException(errors);
            }

            _logger.LogInformation("Password changed: {UserId}", userId);
        }

        private LoginResponse BuildLoginResponse(
            IdentityApplicationUser identityUser,
            ApplicationUser applicant)
        {
            var expiryDays = int.Parse(_config["JwtSettings:ExpiryDays"] ?? "7");
            var expiresAt = DateTime.UtcNow.AddDays(expiryDays);
            var token = GenerateJwtToken(identityUser, applicant, expiresAt);

            return new LoginResponse
            {
                Token = token,
                ExpiresAt = expiresAt,
                User = MapToResponse(identityUser, applicant)
            };
        }

        private string GenerateJwtToken(
            IdentityApplicationUser identityUser,
            ApplicationUser applicant,
            DateTime expiresAt)
        {
            var jwtKey = _config["JwtSettings:Key"]
                ?? throw new InvalidOperationException("JwtSettings:Key missing in appsettings.json");

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, identityUser.Id),
                new(ClaimTypes.Email,           identityUser.Email!),
                new(ClaimTypes.Name,            applicant.FirstName + " " + applicant.LastName),
                new("ApplicantId",              applicant.ApplicantId.ToString()),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var roles = _userManager.GetRolesAsync(identityUser).Result;
            claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["JwtSettings:Issuer"],
                audience: _config["JwtSettings:Audience"],
                claims: claims,
                expires: expiresAt,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private UserResponse MapToResponse(
            IdentityApplicationUser identityUser,
            ApplicationUser applicant)
        {
            var roles = _userManager.GetRolesAsync(identityUser).Result;
            return new UserResponse
            {
                Id = identityUser.Id,
                FullName = applicant.FirstName + " " + applicant.LastName,
                Email = identityUser.Email!,
                PhoneNumber = applicant.MobileNo,
                Roles = roles,
                CreatedAt = applicant.CreatedDate
            };
        }
        public async Task<LoginResponse> GenerateTokenForUser(ApplicationUser user)
        {
            // IdentityUser dhundo using IdentityUserId
            var identityUser = await _userManager.FindByIdAsync(user.IdentityUserId ?? string.Empty);

            if (identityUser == null)
                throw new UnauthorizedAccessException("User not found");

            var expiresAt = DateTime.UtcNow.AddDays(7);
            var token = GenerateJwtToken(identityUser, user, expiresAt);

            return new LoginResponse
            {
                Token = token,
                ExpiresAt = expiresAt,
                User = new UserResponse
                {
                    Id = identityUser.Id,
                    FullName = user.FirstName + " " + user.LastName,
                    Email = identityUser.Email ?? string.Empty
                }
            };
        }
    }
}