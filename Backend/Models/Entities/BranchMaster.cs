using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Entities
{
    public class BranchMaster
    {
        [Key]
        public int BranchId { get; set; }

        public int AgencyId { get; set; }

        public string BranchName { get; set; } = string.Empty;

        public int? BranchParentId { get; set; }

        public int? ZMEOId { get; set; }

        public int? DmeoId { get; set; }

        public int? ZAId { get; set; }

        public int? BranchTypeId { get; set; }

        public string? BranchCode { get; set; }

        public string? BranchLogo { get; set; }

        public int? CityId { get; set; }

        public string? EmailId { get; set; }

        public string? MobileNo { get; set; }

        public string? LandlineNumber { get; set; }

        public string? PinCode { get; set; }

        public string? Address { get; set; }

        public string? PanNumber { get; set; }

        public int? BankLedgerId { get; set; }

        public string? BankLedgerAccountNumber { get; set; }

        public string? BankLedgerIFSCCode { get; set; }

        public string? TinNumber { get; set; }

        public string? CollectionBankName { get; set; }

        public string? CollectionBankAccountNo { get; set; }

        public string? CollectionBankIFSCCode { get; set; }

        public bool IsUser { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public long? CreatedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public long? ModifiedBy { get; set; }

        public bool IsDeleted { get; set; } = false;

        public bool IsActive { get; set; } = true;

        public int? BBYZoneId { get; set; }

        public string? Branch_UUId { get; set; }

        public int? DistrictId { get; set; }

        public string? BranchPunjabiName { get; set; }

        public int? P_BranchId { get; set; }

        public int? RoleId { get; set; }
    }
}
