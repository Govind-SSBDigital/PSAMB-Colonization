using Backend.Helpers;
using Backend.Models.DTOs;
using Backend.Models.Entities;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services.Implementations
{
    public class FileService : IFileService
    {
        private readonly IUnitOfWork _uow;
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<FileService> _logger;

        private string UploadsFolder => Path.Combine(_env.WebRootPath, "uploads");

        public FileService(
            IUnitOfWork uow,
            IWebHostEnvironment env,
            ILogger<FileService> logger)
        {
            _uow = uow;
            _env = env;
            _logger = logger;
        }

        public async Task<FileUploadResponse> UploadAsync(IFormFile file, string userId)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("No file provided");

            if (!FileHelper.IsAllowedExtension(file.FileName))
                throw new ArgumentException("File type not allowed. Allowed: jpg, png, pdf, doc, docx, xlsx, txt, zip");

            if (!FileHelper.IsWithinSizeLimit(file.Length))
                throw new ArgumentException("File size exceeds 10 MB limit");

            Directory.CreateDirectory(UploadsFolder);

            var storedName = FileHelper.GenerateStoredName(file.FileName);
            var fullPath = Path.Combine(UploadsFolder, storedName);

            await using var stream = new FileStream(fullPath, FileMode.Create);
            await file.CopyToAsync(stream);

            var entity = new UploadedFile
            {
                OriginalName = file.FileName,
                StoredName = storedName,
                FilePath = fullPath,
                ContentType = file.ContentType,
                SizeInBytes = file.Length,
                UserId = userId,
                UploadedAt = DateTime.UtcNow
            };

            await _uow.Files.AddAsync(entity);
            await _uow.SaveChangesAsync();

            _logger.LogInformation("File uploaded: {Name} by {UserId}", file.FileName, userId);

            return MapToUploadResponse(entity);
        }

        // ── LIST ─────────────────────────────────────
        public async Task<IEnumerable<FileListResponse>> GetUserFilesAsync(string userId)
        {
            var files = await _uow.Files.FindAsync(f => f.UserId == userId);
            return files
                .OrderByDescending(f => f.UploadedAt)
                .Select(MapToListResponse);
        }

        // ── DOWNLOAD ─────────────────────────────────
        public async Task<(byte[] FileBytes, string ContentType, string FileName)> DownloadAsync(
            int fileId, string userId)
        {
            var file = await _uow.Files.FirstOrDefaultAsync(
                f => f.Id == fileId && f.UserId == userId)
                ?? throw new KeyNotFoundException("File not found or access denied");

            if (!File.Exists(file.FilePath))
                throw new KeyNotFoundException("File no longer exists on server");

            var bytes = await File.ReadAllBytesAsync(file.FilePath);
            return (bytes, file.ContentType, file.OriginalName);
        }

        // ── DELETE ───────────────────────────────────
        public async Task DeleteAsync(int fileId, string userId)
        {
            var file = await _uow.Files.FirstOrDefaultAsync(
                f => f.Id == fileId && f.UserId == userId)
                ?? throw new KeyNotFoundException("File not found or access denied");

            if (File.Exists(file.FilePath))
                File.Delete(file.FilePath);

            file.IsDeleted = true;
            _uow.Files.Update(file);
            await _uow.SaveChangesAsync();

            _logger.LogInformation("File deleted: {FileId} by {UserId}", fileId, userId);
        }

        // ── MAPPERS ──────────────────────────────────
        private FileUploadResponse MapToUploadResponse(UploadedFile f) => new()
        {
            Id = f.Id,
            OriginalName = f.OriginalName,
            ContentType = f.ContentType,
            SizeInBytes = f.SizeInBytes,
            SizeFormatted = FileHelper.FormatFileSize(f.SizeInBytes),
            DownloadUrl = $"/api/file/download/{f.Id}",
            UploadedAt = f.UploadedAt
        };

        private static FileListResponse MapToListResponse(UploadedFile f) => new()
        {
            Id = f.Id,
            OriginalName = f.OriginalName,
            ContentType = f.ContentType,
            SizeFormatted = FileHelper.FormatFileSize(f.SizeInBytes),
            DownloadUrl = $"/api/file/download/{f.Id}",
            UploadedAt = f.UploadedAt
        };
    }
}
