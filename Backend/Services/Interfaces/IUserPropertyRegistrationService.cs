using Backend.Helpers;
using Backend.Models.Dtos;
using Backend.Models.DTOs;
using Backend.Services.Implementations;

namespace Backend.Services.Interfaces
{
    public interface IUserPropertyRegistrationService
    {
        Task<ApiResponse<UserPropertyRegistrationDto>> UserPropertyRegisterAsync(UserPropertyRegistrationDto dto);

    }
}
