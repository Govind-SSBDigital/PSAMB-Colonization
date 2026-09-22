using Backend.Models.DTOs;

namespace Backend.Services.Interfaces
{
    public interface IFileService
    {
        Task<FileUploadResponse> UploadAsync(
         IFormFile file,
         int documentCategoryId,
         int documentTypeId);
        Task DeleteAsync(int fileId, string userId);
    }
}
