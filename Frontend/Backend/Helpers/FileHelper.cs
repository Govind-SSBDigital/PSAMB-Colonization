namespace Backend.Helpers
{
    public static class FileHelper
    {
        private static readonly string[] AllowedExtensions =
            [".jpg", ".jpeg", ".png", ".gif", ".pdf", ".doc", ".docx", ".xlsx", ".txt", ".zip"];

        private static readonly long MaxFileSizeBytes = 10 * 1024 * 1024; // 10 MB

        public static bool IsAllowedExtension(string fileName)
        {
            var ext = Path.GetExtension(fileName).ToLowerInvariant();
            return AllowedExtensions.Contains(ext);
        }

        public static bool IsWithinSizeLimit(long sizeInBytes)
            => sizeInBytes <= MaxFileSizeBytes;

        public static string FormatFileSize(long bytes)
        {
            if (bytes < 1024) return $"{bytes} B";
            if (bytes < 1024 * 1024) return $"{bytes / 1024.0:F1} KB";
            if (bytes < 1024 * 1024 * 1024) return $"{bytes / (1024.0 * 1024):F1} MB";
            return $"{bytes / (1024.0 * 1024 * 1024):F1} GB";
        }

        public static string GenerateStoredName(string originalFileName)
        {
            var ext = Path.GetExtension(originalFileName);
            return $"{Guid.NewGuid()}{ext}";
        }
    }
}
