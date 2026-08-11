namespace Backend.Models.Entities
{
    public class ApplicantAuth
    {
        public long AuthId { get; set; }
        public long ApplicantId { get; set; }

        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string SaltKey { get; set; } = string.Empty;

        public int FailedLoginAttempts { get; set; } = 0;
        public bool IsLocked { get; set; } = false;

        public DateTime? LastLoginAt { get; set; }
        public string? LastLoginIP { get; set; }
        public bool IsDeleted { get; set; } = false;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public long? CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public long? UpdatedBy { get; set; }
    }



}
