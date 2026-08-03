using Backend.Helpers;
using Backend.Models.Dtos;
using static Backend.Models.Dtos.DistrictMasterDto;

namespace Backend.Services.Interfaces
{
    public interface ICommon
    {
        Task<List<DistrictDto>> GetAllDistrictsAsync();
        Task<ApiResponse<List<StateDto>>> GetAllStates();
        Task<ApiResponse<List<MarketCommitteeDto>>> GetMarketCommitteesAsync(int? districtId);
        //Task<ApiResponse<List<MandiDto>>> GetMandisByDistrictAsync();
        Task<ApiResponse<List<PlotTypeDto>>> GetPlotTypesAsync(int? propertyTypeId);
        Task<ApiResponse<List<PlotSizeDto>>> GetPlotSizesAsync();
        Task<ApiResponse<List<PlanDto>>> GetPlansAsync();
        Task<ApiResponse<List<PropertyTypeDto>>> GetPropertyTypesAsync();
        Task<ApiResponse<List<BidderTypeDto>>> GetBidderTypesAsync();
        Task<ApiResponse<List<ApplicationStatusDto>>> GetApplicationStatusesAsync();
        Task<ApiResponse<List<PropertyCategoryDto>>> GetPropertyCategoriesAsync();
    }
}
