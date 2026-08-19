using Microsoft.AspNetCore.Identity;

namespace Backend.Models.Entities
{
    public class IdentityApplicationUser : IdentityUser
    {
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsFirstLogin { get; set; } = true;
    }
}
