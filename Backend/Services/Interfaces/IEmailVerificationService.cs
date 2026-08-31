using Backend.Controllers;
using Backend.Models.DTOs;
using static Backend.Services.Implementations.EmailVerificationService;

namespace Backend.Services.Interfaces
{
    public interface IEmailVerificationService
    {
        Task<bool> SendOtpAsync(string email);
        Task<VerifyFirstResponse> verifyfirt(verifydatamodel verifydatamodel);
        Task<bool> VerifyOtpAsync(string email, string otp);
    }
}
