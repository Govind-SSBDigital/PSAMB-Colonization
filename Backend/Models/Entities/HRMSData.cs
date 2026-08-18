using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models.Entities
{
    [Table("HRMSData")]
    public class HRMSData
    {
        public string HRMSCODE { get; set; } = null!;
        public string? EmployeeName { get; set; }
        public string? MobileNo { get; set; }
        public int? DesignationId { get; set; }
        public string? Email { get; set; }
    }
}
