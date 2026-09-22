using Backend.Data;
using Backend.Helpers;
using Backend.Models.DTOs;
using Backend.Models.Entities;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;
using Microsoft.Extensions.Options;

namespace Backend.Services.Implementations
{
    public class FileService : IFileService
    {
        private readonly IUnitOfWork _uow;
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<FileService> _logger;
        private readonly ApplicationDbContext _context;
        private readonly FileStorageSettings _settings;
        private string UploadsFolder => Path.Combine(_env.WebRootPath, "uploads");

        private readonly string[] _allowedExtensions =
    {
        ".jpg",
        ".jpeg",
        ".png",
        ".pdf"
    };

        private readonly string[] _allowedContentTypes =
        {
        "image/jpeg",
        "image/png",
        "application/pdf"
    };

        public FileService(
            ApplicationDbContext context,
            IOptions<FileStorageSettings> settings)
        {
            _context = context;
            _settings = settings.Value;
        }

        public async Task<FileUploadResponse> UploadAsync(
                IFormFile file,
                int documentCategoryId,
                int documentTypeId)
        {

            if (file == null || file.Length == 0)
            {
                throw new ArgumentException(
                    "Please select a file.");
            }

            var maxFileSize =
                _settings.MaxFileSizeMB * 1024L * 1024L;

            if (file.Length > maxFileSize)
            {
                throw new ArgumentException(
                    $"File size cannot exceed {_settings.MaxFileSizeMB} MB.");
            }

            if (!Enum.IsDefined(
                    typeof(DocumentCategory),
                    documentCategoryId))
            {
                throw new ArgumentException(
                    "Invalid document category.");
            }

            var extension =
                Path.GetExtension(file.FileName)
                .ToLowerInvariant();

            if (!_allowedExtensions.Contains(extension))
            {
                throw new ArgumentException(
                    "Only JPG, JPEG, PNG and PDF files are allowed.");
            }

            if (!_allowedContentTypes.Contains(
                    file.ContentType.ToLowerInvariant()))
            {
                throw new ArgumentException(
                    "Invalid file type.");
            }

            var category =
                (DocumentCategory)documentCategoryId;

            string categoryFolder = category switch
            {
                DocumentCategory.Photograph => "Photograph",

                DocumentCategory.IdentityProof => "IdentityProof",

                DocumentCategory.AddressProof => "AddressProof",

                _ => throw new ArgumentException(
                    "Invalid document category.")
            };

            // 7. Get document type folder
            //
            // IMPORTANT:
            // Replace this with DB lookup once
            // your document master table is confirmed.

            string documentTypeFolder =
                GetDocumentTypeFolder(
                    documentCategoryId,
                    documentTypeId);

            var userFolder =
                Path.Combine(
                    _settings.RootPath,
                    categoryFolder,
                    documentTypeFolder
                    );

            Directory.CreateDirectory(userFolder);

            var storedFileName =
                $"{Guid.NewGuid():N}{extension}";

            var fullPath =
                Path.Combine(
                    userFolder,
                    storedFileName);

            await using (var stream =
                new FileStream(
                    fullPath,
                    FileMode.CreateNew))
            {
                await file.CopyToAsync(stream);
            }

            var relativePath =
                Path.Combine(
                    categoryFolder,
                    documentTypeFolder,
                    storedFileName)
                .Replace("\\", "/");

            var document = new UserDocument
            {
                UserId = "0",

                DocumentCategoryId =
                    documentCategoryId,

                DocumentTypeId =
                    documentTypeId,

                OriginalFileName =
                    Path.GetFileName(file.FileName),

                StoredFileName =
                    storedFileName,

                FileExtension =
                    extension,

                FileSize =
                    file.Length,

                RelativePath =
                    relativePath,

                FullPath =
                    fullPath,

                ContentType =
                    file.ContentType,

                CreatedDate =
                    DateTime.UtcNow,

                IsActive = true,

                IsDeleted = false
            };

            _context.UserDocuments.Add(document);

            await _context.SaveChangesAsync();

            return new FileUploadResponse
            {
                UserDocumentId =
                    document.UserDocumentId,

                OriginalFileName =
                    document.OriginalFileName ?? "",

                StoredFileName =
                    document.StoredFileName,

                DocumentCategoryId =
                    document.DocumentCategoryId,

                DocumentTypeId =
                    document.DocumentTypeId,

                RelativePath =
                    document.RelativePath,

                FileUrl =
                    document.RelativePath
            };
        }

        private string GetDocumentTypeFolder(
       int categoryId,
       int documentTypeId)
        {
            // TEMPORARY MAPPING
            // We will replace this with your
            // actual Document Master table.

            if (categoryId ==
                (int)DocumentCategory.Photograph)
            {
                return "Photograph";
            }

            if (categoryId ==
                (int)DocumentCategory.IdentityProof)
            {
                return documentTypeId switch
                {
                    1 => "AadhaarCard",
                    2 => "VoterCard",
                    3 => "Passport",
                    4 => "DrivingLicense",

                    _ => throw new ArgumentException(
                        "Invalid identity document type.")
                };
            }

            if (categoryId ==
                (int)DocumentCategory.AddressProof)
            {
                return documentTypeId switch
                {
                    1 => "AadhaarCard",
                    2 => "Passport",
                    3 => "ElectricityBill",
                    4 => "WaterBill",
                    5 => "RentAgreement",
                    6 => "RegistryDeed",

                    _ => throw new ArgumentException(
                        "Invalid address document type.")
                };
            }

            throw new ArgumentException(
                "Invalid document category.");
        }    
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
    }
}
