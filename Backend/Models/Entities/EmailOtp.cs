namespace Backend.Models.Entities
{
    public class EmailOtp
    {
        public long OTPId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string OTP { get; set; } = string.Empty;
        public bool IsUsed { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}