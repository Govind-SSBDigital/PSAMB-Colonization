namespace Backend.Services.Interfaces
{
    public interface IMobileVerificationService
    {

        Task<bool> SendSmsAsync(string mobileNo, string message, string otp, long applicantId);
        Task<bool> VerifyOtpAsync(string mobileNo, string otp);
    }
}
