namespace Backend.Models.DTOs
{
    public class FileUploadResponse
    {
        public int Id { get; set; }
        public string OriginalName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long SizeInBytes { get; set; }
        public string SizeFormatted { get; set; } = string.Empty;
        public string DownloadUrl { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; }
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
}
