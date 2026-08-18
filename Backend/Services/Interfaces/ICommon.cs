using Backend.Helpers;
using Backend.Models.Dtos;
using Backend.Models.DTOs;
using static Backend.Models.Dtos.DistrictMasterDto;

namespace Backend.Services.Interfaces
{
    public interface ICommon
    {
        Task<ApiResponse<List<StateDto>>> GetAllStates();
        Task<List<DistrictDto>> GetAllDistrictsAsync(int stateid);
        Task<List<CityMasterDto>> GetAllCityByDistrictID(int districtid);
        Task<ApiResponse<List<MarketCommitteeDto>>> GetMarketCommitteesAsync(int? districtId);
        Task<ApiResponse<List<MandiDto>>> GetMandisByMarketCommiteeByDistrictAsync(int branchID);
        Task<ApiResponse<List<PlotTypeDto>>> GetPlotTypesAsync(int? propertyTypeId);
        Task<ApiResponse<List<PlotSizeDto>>> GetPlotSizesAsync();
        Task<ApiResponse<List<PlanDto>>> GetPlansAsync();
        Task<ApiResponse<List<PropertyTypeDto>>> GetPropertyTypesAsync();
        Task<ApiResponse<List<BidderTypeDto>>> GetBidderTypesAsync();
        Task<ApiResponse<List<ApplicationStatusDto>>> GetApplicationStatusesAsync();
        Task<ApiResponse<List<PropertyCategoryDto>>> GetPropertyCategoriesAsync();
    }
}
