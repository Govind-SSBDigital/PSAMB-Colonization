namespace Backend.Models.Dtos
{
    public class DistrictMasterDto
    {
        public class DistrictDto
        {
            public int DistrictId { get; set; }
            public int StateId { get; set; }
            public string DistrictName { get; set; } = string.Empty;
            public string DistrictCode { get; set; } = string.Empty;
            public string? DistrictPunjabiName { get; set; }
            public bool IsDeleted { get; set; }
            public bool IsActive { get; set; }
        }
    }
}
