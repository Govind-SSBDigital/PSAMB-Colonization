namespace PunjabEstatePortal.Core.Entities
{
    public class MenuFlatResult
    {
        public int MenuId { get; set; }
        public string MenuName { get; set; } = string.Empty;
        public string? MenuIcon { get; set; }
        public int MenuSortOrder { get; set; }
        public int SubMenuId { get; set; }
        public string SubMenuName { get; set; } = string.Empty;
        public string Route { get; set; } = string.Empty;
        public string? SubMenuIcon { get; set; }
        public int SubMenuSortOrder { get; set; }
    }
    public class SubMenuDto
    {
        public int SubMenuId { get; set; }
        public string SubMenuName { get; set; } = string.Empty;
        public string Route { get; set; } = string.Empty;
        public string? Icon { get; set; }
        public int SortOrder { get; set; }
    }

    public class MenuDto
    {
        public int MenuId { get; set; }
        public string MenuName { get; set; } = string.Empty;
        public string? Icon { get; set; }
        public int SortOrder { get; set; }
        public List<SubMenuDto> SubMenus { get; set; } = new();
    }
}