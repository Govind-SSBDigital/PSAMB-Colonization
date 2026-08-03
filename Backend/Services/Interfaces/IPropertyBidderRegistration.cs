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
    }
}
