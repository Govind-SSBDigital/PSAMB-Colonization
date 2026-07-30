namespace Backend.Models.DTOs
{
    // ── REQUESTS ─────────────────────────────────────
    // Models/DTOs/AuthDtos.cs

    public class RegisterRequest
    {
        // Step 1 - Category
        public int CategoryId { get; set; }

        // Step 2 - Personal Details
        public int Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string? LastName { get; set; }
        //public int RelationType { get; set; } = 1;

        public string? FatherHusbandFirstName { get; set; }
        public string? FatherHusbandLastName { get; set; }
        public string? MotherFirstName { get; set; }
        public string? MotherLastName { get; set; }
        //public string? SpouseFirstName { get; set; }
        //public string? SpouseLastName { get; set; }
        public string Email { get; set; } = string.Empty;
        public string MobileNo { get; set; } = string.Empty;

        // Password
        public string? Password { get; set; } = string.Empty;
        public string? ConfirmPassword { get; set; } = string.Empty;

        // Step 3 - Documents
        public int? IdentDocTypeId { get; set; }
        public string? IdentDocNumber { get; set; }
        public string? PANNumber { get; set; }

        // Step 4 - Individual Address
        public int? IndividualStateId { get; set; }
        public int? IndividualDistrictId { get; set; }
        public int? IndividualCityId { get; set; }
        public string? IndividualPinCode { get; set; }
        public string? IndividualPlotStreetLandmark { get; set; }
        public int? AddrDocTypeId { get; set; }
        public string? AddrDocNumber { get; set; }

        // Step 5 - Business (optional)
        public string? FirmName { get; set; }
        public string? GSTNumber { get; set; }
        public string? MandiPropertyCode { get; set; }
        public bool? IsSameAsIndividualAddress { get; set; }
        public int? BusinessStateId { get; set; }
        public int? BusinessDistrictId { get; set; }
        public int? BusinessCityId { get; set; }
        public string? BusinessPinCode { get; set; }
        public string? BusinessPlotStreetLandmark { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
    public class MobileOtpLoginRequest
    {
        public string MobileNumber { get; set; } = string.Empty;
        public string Otp { get; set; } = string.Empty;
    }
    public class ChangePasswordRequest
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
        public string ConfirmNewPassword { get; set; } = string.Empty;
    }

    public class UpdateProfileRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
    }

    // ── RESPONSES ────────────────────────────────────
    public class UserResponse
    {
        public string Id { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public IList<string> Roles { get; set; } = new List<string>();
        public DateTime CreatedAt { get; set; }
    }

    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public UserResponse User { get; set; } = null!;
        public string UserId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string EntityType { get; set; }
    }
}
