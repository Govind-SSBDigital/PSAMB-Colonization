namespace Backend.Models.DTOs
{
    public class StateResponse
    {
        public int StateId { get; set; }
        public string StateName { get; set; } = string.Empty;
        public string StateCode { get; set; } = string.Empty;
    }

    public class DistrictResponse
    {
        public int DistrictId { get; set; }
        public int StateId { get; set; }
        public string DistrictName { get; set; } = string.Empty;
        public string DistrictCode { get; set; } = string.Empty;
        public string? DistrictPunjabiName { get; set; }
    }

    public class CityResponse
    {
        public int CityId { get; set; }
        public int DistrictId { get; set; }
        public string CityName { get; set; } = string.Empty;
        public string? CityCode { get; set; }
        public bool IsTehsil { get; set; }
    }
}