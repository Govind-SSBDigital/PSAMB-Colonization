using Backend.Helpers;
using Backend.Models.Dtos;

namespace Backend.Services.Interfaces
{
    public interface IPropertyBidderRegistration
    {
        Task<ApiResponse<PropertyBidderRegistrationDto>> RegisterPropertyAsync(PropertyBidderRegistrationDto dto);
        Task<ApiResponse<PropertyBidderRegistrationDto>> GetRegistrationByIdAsync(int id);
        Task<ApiResponse<PropertyBidderRegistrationDto>> GetRegistrationByPropertyCodeAsync(string propertyCode);
        Task<ApiResponse<List<PropertyBidderRegistrationDto>>> GetAllRegistrationsAsync();
        Task<ApiResponse<PropertyBidderRegistrationDto>> UpdateRegisterPropertyAsync(PropertyBidderRegistrationDto dto);
        Task<ApiResponse<List<PropertyBidderRegistrationDto>>> GetPendingForClerk(string? userId=null,string? searchCode = null,int disctrictid =0, int branchid = 0,int mandiid = 0);
        Task<ApiResponse<bool>> VerifyByClerk(ClerkVerificationDto dto);
        Task<ApiResponse<PropertyBidderRegistrationDto>> GetPropertyEAuctionDetailsByPropertyCodeAsync(string propertyCode);
        Task<ApiResponse<List<DistrictMasterDto>>> GetDistrictByHRMSUser(string v);
        Task<ApiResponse<List<PropertyBidderRegistration>>> GetAllRegisterPropertyById(string v);
    }
}
