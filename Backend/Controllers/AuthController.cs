using Backend.Helpers;
using Backend.Models.DTOs;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Security.Claims;
using LoginRequest = Backend.Models.DTOs.LoginRequest;
using RegisterRequest = Backend.Models.DTOs.RegisterRequest;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<ActionResult<ApiResponse<LoginResponse>>> Register(
            [FromBody] RegisterRequest request)
        {
            var result = await _authService.RegisterAsync(request);
            return Ok(ApiResponse<LoginResponse>.Ok(result, "Registration successful"));
        }

        [HttpPost("login")]
        [EnableRateLimiting("AuthPolicy")]
        public async Task<ActionResult<ApiResponse<LoginResponse>>> Login(
            [FromBody] LoginRequest request)
        {
            var result = await _authService.LoginAsync(request);
            return Ok(ApiResponse<LoginResponse>.Ok(result, "Login successful"));
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<UserResponse>>> GetProfile()
        {
            var result = await _authService.GetProfileAsync(GetUserId());
            return Ok(ApiResponse<UserResponse>.Ok(result));
        }

        [HttpPut("profile")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<UserResponse>>> UpdateProfile(
            [FromBody] UpdateProfileRequest request)
        {
            var result = await _authService.UpdateProfileAsync(GetUserId(), request);
            return Ok(ApiResponse<UserResponse>.Ok(result, "Profile updated"));
        }
        [HttpPost("change-password")]
        [Authorize]
        public async Task<ActionResult<ApiResponse>> ChangePassword(
            [FromBody] ChangePasswordRequest request)
        {
            await _authService.ChangePasswordAsync(GetUserId(), request);
            return Ok(ApiResponse.Ok("Password changed successfully"));
        }

        [HttpGet("admin-test")]
        [Authorize(Roles = "Admin")]
        public IActionResult AdminTest()
        {
            return Ok(ApiResponse.Ok("You are Admin!"));
        }

        private string GetUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("Invalid token");
    }
}
