namespace Backend.Services.Interfaces
{
    public interface IEmailVerificationService
    {
        Task<bool> SendOtpAsync(string email);
        Task<bool> VerifyOtpAsync(string email, string otp);
    }
}
