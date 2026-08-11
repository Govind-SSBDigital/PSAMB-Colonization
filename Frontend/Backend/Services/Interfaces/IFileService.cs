using Backend.Models.DTOs;

namespace Backend.Services.Interfaces
{
    public interface IFileService
    {
        Task<FileUploadResponse> UploadAsync(IFormFile file, string userId);
        Task<IEnumerable<FileListResponse>> GetUserFilesAsync(string userId);
        Task<(byte[] FileBytes, string ContentType, string FileName)> DownloadAsync(int fileId, string userId);
        Task DeleteAsync(int fileId, string userId);
    }
}
