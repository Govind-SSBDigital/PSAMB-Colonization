using PunjabEstatePortal.Core.Entities;

namespace Backend.Models.DTOs
{
    public class UserProfileWithMenuResponse
    {
        public UserResponse Profile { get; set; } = null!;
        public List<string> Roles { get; set; } = new();
        public List<MenuDto> Menus { get; set; } = new();
    }
}
