namespace Backend.Models.Settings
{
    public class FileUploadSettings
    {
        public string RootPath { get; set; } = string.Empty;   // e.g. "E:\\ColonizationDocuments"
        public int MaxFileSizeMB { get; set; } = 5;
    }
}
