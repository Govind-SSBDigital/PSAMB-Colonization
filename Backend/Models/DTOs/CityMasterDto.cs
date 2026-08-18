namespace Backend.Models.DTOs
{
    public class CityMasterDto
    {
        public int CityId { get; set; }
        public int DistrictId { get; set; }
        public string CityName { get; set; } = string.Empty;
        public string? CityCode { get; set; }
        public bool IsTehsil { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsActive { get; set; }
    }
}
