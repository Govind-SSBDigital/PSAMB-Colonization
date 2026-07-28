namespace Backend.Models.Entities
{
    public class StateMaster
    {
        public int StateId { get; set; }
        public string StateName { get; set; } = string.Empty;
        public string StateCode { get; set; } = string.Empty;
        public int CountryId { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsActive { get; set; }
    }

    public class DistrictMaster
    {
        public int DistrictId { get; set; }
        public int StateId { get; set; }
        public string DistrictName { get; set; } = string.Empty;
        public string DistrictCode { get; set; } = string.Empty;
        public string? DistrictPunjabiName { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsActive { get; set; }
    }

    public class CityMaster
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