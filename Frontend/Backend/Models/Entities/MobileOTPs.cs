namespace Backend.Models.Entities
{
    public class MobileOTPs
    {
        public long OTPId { get; set; }
        public long ApplicantId { get; set; }
        public string MobileNumber { get; set; } = string.Empty;
        public string OTP { get; set; } = string.Empty;
        public bool IsUsed { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
