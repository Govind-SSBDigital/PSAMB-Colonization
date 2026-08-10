using Backend.Models.DTOs;
using Backend.Models.Entities;
using System.Threading.Tasks;

namespace Backend.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponse> RegisterAsync(RegisterRequest request);
        Task<LoginResponse> LoginAsync(LoginRequest request);
        Task<UserProfileWithMenuResponse> GetProfileAsync(string userId);
        Task<UserResponse> UpdateProfileAsync(string userId, UpdateProfileRequest request);
        Task ChangePasswordAsync(string userId, ChangePasswordRequest request);
        Task<LoginResponse> GenerateTokenForUser(ApplicationUser user);
    }
}
