using Backend.Models.DTOs;

namespace Backend.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponse> RegisterAsync(RegisterRequest request);
        Task<LoginResponse> LoginAsync(LoginRequest request);
        Task<UserResponse> GetProfileAsync(string userId);
        Task<UserResponse> UpdateProfileAsync(string userId, UpdateProfileRequest request);
        Task ChangePasswordAsync(string userId, ChangePasswordRequest request);
    }
}
