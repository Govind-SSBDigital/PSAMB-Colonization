using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Data;

public class ApplicationUser : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class ApplicationUsers
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int RoleId { get; set; }

    [ForeignKey(nameof(RoleId))]
    public ApplicationUser? User { get; set; }

    public int CategoryID { get; set; }

    [Required]
    [MaxLength(20)]
    public string Gender { get; set; } = string.Empty;

    [Required]
    public DateTime DateOfBirth { get; set; }

    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? LastName { get; set; }

    [Required]
    [MaxLength(100)]
    public string FatherFirstName { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? FatherLastName { get; set; }

    [Required]
    [MaxLength(100)]
    public string MotherFirstName { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? MotherLastName { get; set; }

    [Required]
    [Phone]
    [MaxLength(20)]
    public string MobileNumber { get; set; } = string.Empty;

    [EmailAddress]
    [MaxLength(256)]
    public string? Email { get; set; }

    [Required]
    public string DocumentType { get; set; } = string.Empty;

    [Required]
    public string DocumentNumber { get; set; } = string.Empty;

    [Required]
    public string DocumentFileName { get; set; } = string.Empty;

    [Required]
    public string PanNumber { get; set; } = string.Empty;

    [Required]
    public string PanFileName { get; set; } = string.Empty;

    [Required]
    public string ProfileImage { get; set; } = string.Empty;

    [Required]
    public string AddressState { get; set; } = string.Empty;

    [Required]
    public string AddressDistrict { get; set; } = string.Empty;

    [Required]
    public string AddressCity { get; set; } = string.Empty;

    [Required]
    public string AddressPincode { get; set; } = string.Empty;

    [Required]
    public string AddressLandmark { get; set; } = string.Empty;

    [Required]
    public string AddressDocType { get; set; } = string.Empty;

    [Required]
    public string AddressDocNumber { get; set; } = string.Empty;

    [Required]
    public string AddressDocFileName { get; set; } = string.Empty;

    public string? FirmName { get; set; }
    public string? GstNumber { get; set; }

    public bool IsSameAddress { get; set; }

    public string? BusinessState { get; set; }
    public string? BusinessDistrict { get; set; }
    public string? BusinessCity { get; set; }
    public string? BusinessPincode { get; set; }
    public string? BusinessLandmark { get; set; }
    public string? OfficePhotoFileName { get; set; }
    public string? MandiPropertyCode { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
