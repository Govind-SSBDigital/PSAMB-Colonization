using Backend.Models.DTOs;

namespace Backend.Services.Interfaces
{
    public interface IFileService
    {
        Task<FileUploadResponse> UploadAsync(
            IFormFile file,
            int documentCategoryId,
            int documentTypeId,
            string? documentNumber,
            string sessionId);

        Task LinkDocumentsToApplicantAsync(int applicantId, string sessionId, int?[] documentIds);
        Task DeleteAsync(int fileId, string userId);
    }
}
