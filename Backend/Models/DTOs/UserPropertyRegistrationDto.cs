using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs
{
    public class UserPropertyRegistrationDto
    {

        public int Id { get; set; }
        public string? PropertyCode { get; set; }
        public int MandiId { get; set; }
        public int BranchId { get; set; }
        public int DistrictId { get; set; }
        public int? PlotTypeId { get; set; }
        public int? PlanId { get; set; }
        public string? PlotSize { get; set; }
        public int? PlotNo { get; set; }
        public int? ApplicantId { get; set; }
        public string? CurrentOwnerName { get; set; }
        public string? FatherHusbandName { get; set; }

        public string? MobileNumber { get; set; }
        public string? Email { get; set; }
        public int? OwnerStateID { get; set; }
        public int? OwnerDistrtictID { get; set; }
        public int? OwnerCityID { get; set; }
        public string? Address { get; set; }
        public string? AadhaarNumber { get; set; }
        public string? PanNumber { get; set; }
        public int? VerificationUserEndStatusId { get; set; }
    }
}
