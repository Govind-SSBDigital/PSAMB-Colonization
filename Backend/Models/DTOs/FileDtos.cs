namespace Backend.Models.DTOs
{
    public class FileUploadResponse
    {
        public int UserDocumentId { get; set; }

        public string OriginalFileName { get; set; } = string.Empty;

        public string StoredFileName { get; set; } = string.Empty;

        public int DocumentCategoryId { get; set; }

        public int DocumentTypeId { get; set; }

        public string RelativePath { get; set; } = string.Empty;

        public string FileUrl { get; set; } = string.Empty;
    }

    public class FileListResponse
    {
        public int Id { get; set; }
        public string OriginalName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public string SizeFormatted { get; set; } = string.Empty;
        public string DownloadUrl { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; }
    }
    public class FileStorageSettings
    {
        public string RootPath { get; set; } = string.Empty;
        public int MaxFileSizeMB { get; set; } = 5;
    }
    public class FileUploadRequest
    {
        public IFormFile File { get; set; } = null!;

        // 1 = Photograph, 2 = Identity Proof, 3 = Address Proof
        public int DocumentCategoryId { get; set; }

        // e.g. 1 = Aadhaar, 2 = Passport, 3 = Water Bill
        public int DocumentTypeId { get; set; }
    }
    public enum DocumentCategory
    {
        Photograph = 1,
        IdentityProof = 2,
        AddressProof = 3
    }
    public class UserDocument
    {
        public int UserDocumentId { get; set; }

        public string UserId { get; set; } = string.Empty;

        public int DocumentCategoryId { get; set; }

        public int DocumentTypeId { get; set; }

        public string? OriginalFileName { get; set; }

        public string StoredFileName { get; set; } = string.Empty;

        public string? FileExtension { get; set; }

        public long? FileSize { get; set; }

        public string RelativePath { get; set; } = string.Empty;

        public string FullPath { get; set; } = string.Empty;

        public string? ContentType { get; set; }

        public DateTime CreatedDate { get; set; }

        public bool IsActive { get; set; }

        public bool IsDeleted { get; set; }
    }
}
