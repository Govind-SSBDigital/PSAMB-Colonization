using Backend.Models.DTOs;

namespace Backend.Services.Interfaces
{
    public interface ISendCredUserService
    {
        Task<bool> SendCredentialsAsync(SendCredModel model);
    }
}
