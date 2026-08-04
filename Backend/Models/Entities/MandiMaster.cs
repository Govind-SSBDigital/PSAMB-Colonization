using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Entities
{
    public class MandiMaster
    {
        [Key]
        public int MandiId { get; set; }

        public int DistrictId { get; set; }

        public string MandiName { get; set; } = string.Empty;

        public string? MandiCode { get; set; }

        public DateTime CreatedDate { get; set; }

        public long? CreatedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public long? ModifiedBy { get; set; }

        public bool IsDeleted { get; set; } = false;

        public bool IsActive { get; set; } = true;

        public int MandiCategoryId { get; set; }

        public int? PrincipalYardId { get; set; }

        public int? MandiTypeId { get; set; }

        public float? DailyProduction { get; set; }

        public bool? IsPPM { get; set; }

        public string? MandiPunjabiName { get; set; }

        public int? P_MandiId { get; set; }

        public bool? IsClosed { get; set; }

        public DateTime? MandiClosedDate { get; set; }

    }
}
