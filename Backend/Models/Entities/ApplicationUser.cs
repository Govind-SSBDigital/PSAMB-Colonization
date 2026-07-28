using Microsoft.AspNetCore.Identity;

namespace Backend.Models.Entities;
public class ApplicationUser
{
    public long ApplicantId { get; set; }
    public string? IdentityUserId { get; set; }
    public int? CategoryId { get; set; }
    public int? Gender { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string? LastName { get; set; }
    public string? FatherHusbandFirstName { get; set; }
    public string? FatherHusbandLastName { get; set; }
    public string? MotherFirstName { get; set; }
    public string? MotherLastName { get; set; }
    public string Email { get; set; } = string.Empty;
    public string MobileNo { get; set; } = string.Empty;
    public string? PhotoPath { get; set; }

    public int? IdentDocTypeId { get; set; }
    public string? IdentDocNumber { get; set; }
    public string? IdentDocPath { get; set; }

    public string? PANNumber { get; set; }
    public string? PANDocPath { get; set; }

    public int? IndividualStateId { get; set; }
    public int? IndividualDistrictId { get; set; }
    public int? IndividualCityId { get; set; }
    public string? IndividualPinCode { get; set; }
    public string? IndividualPlotStreetLandmark { get; set; }

    public int? AddrDocTypeId { get; set; }
    public string? AddrDocNumber { get; set; }
    public string? AddrDocPath { get; set; }

    public string? FirmName { get; set; }
    public string? GSTNumber { get; set; }
    public string? MandiPropertyCode { get; set; }
    public string? OfficePropertyPhotoPath { get; set; }
    public bool? IsSameAsIndividualAddress { get; set; }
    public int? BusinessStateId { get; set; }
    public int? BusinessDistrictId { get; set; }
    public int? BusinessCityId { get; set; }
    public string? BusinessPinCode { get; set; }
    public string? BusinessPlotStreetLandmark { get; set; }

    public bool IsDeleted { get; set; } = false;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public long? CreatedBy { get; set; }
}
