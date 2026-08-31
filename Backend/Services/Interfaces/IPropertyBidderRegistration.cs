using Backend.Helpers;
using Backend.Models.Dtos;
using static Backend.Models.Dtos.DistrictMasterDto;

namespace Backend.Services.Interfaces
{
    public interface IPropertyBidderRegistration
    {
        Task<ApiResponse<PropertyBidderRegistrationDto>> RegisterPropertyAsync(PropertyBidderRegistrationDto dto);
        Task<ApiResponse<PropertyBidderRegistrationDto>> GetRegistrationByIdAsync(int id);
        Task<ApiResponse<PropertyBidderRegistrationDto>> GetRegistrationByPropertyCodeAsync(string propertyCode);
        Task<ApiResponse<List<PropertyBidderRegistrationDto>>> GetAllRegistrationsAsync();
        Task<ApiResponse<PropertyBidderRegistrationDto>> UpdateRegisterPropertyAsync(PropertyBidderRegistrationDto dto);
        Task<ApiResponse<List<PropertyBidderRegistrationDto>>> GetPendingForClerk(string? searchCode = null);
        Task<ApiResponse<bool>> VerifyByClerk(ClerkVerificationDto dto);
        Task<ApiResponse<PropertyBidderRegistrationDto>> GetPropertyEAuctionDetailsByPropertyCodeAsync(string propertyCode);
        Task<ApiResponse<List<DistrictDto>>> GetPropertyDistrictsAsync();
        Task<ApiResponse<List<BranchDto>>> GetPropertyBranchesAsync(int districtId);
        Task<ApiResponse<List<MandiDto>>> GetPropertyMandisAsync(int branchId);
        Task<ApiResponse<List<PlotTypeDto>>> GetPropertyPlotTypesAsync(int mandiId);
        Task<List<AuctionedPlotDto>> GetAuctionedPlotsAsync(int mandiId, int plotTypeId);

        Task<ApiResponse<PropertyBidderRegistrationDto>> GetPropertyDetailsByMandiPlot(int MandiId,int PlotTypeId,string PlotNo);
    }
}
