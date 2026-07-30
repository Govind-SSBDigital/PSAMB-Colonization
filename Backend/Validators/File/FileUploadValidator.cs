// Validators/File/FileUploadValidator.cs
using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace Backend.Validators.File
{
    public class FileUploadRequest
    {
        public IFormFile File { get; set; } = null!;
        public bool IsPhoto { get; set; } = false; // true = 100KB limit, false = 500KB
    }

    public class FileUploadValidator : AbstractValidator<FileUploadRequest>
    {
        private static readonly string[] AllowedExtensions =
            [".jpg", ".jpeg", ".png", ".gif", ".pdf", ".doc", ".docx", ".xlsx", ".txt", ".zip"];

        private static readonly string[] PhotoExtensions =
            [".jpg", ".jpeg", ".png"];

        public FileUploadValidator()
        {
            RuleFor(x => x.File)
                .NotNull().WithMessage("Please select a file");

            // Photo — 100KB limit
            RuleFor(x => x.File)
                .Must(f => f.Length <= 100 * 1024)
                    .WithMessage("Photo size must not exceed 100KB")
                .Must(f => PhotoExtensions
                    .Contains(Path.GetExtension(f.FileName).ToLower()))
                    .WithMessage("Only JPG, JPEG and PNG formats are allowed for photos")
                .When(x => x.File != null && x.IsPhoto);

            // Documents — 500KB limit
            RuleFor(x => x.File)
                .Must(f => f.Length <= 500 * 1024)
                    .WithMessage("Document size must not exceed 500KB")
                .Must(f => AllowedExtensions
                    .Contains(Path.GetExtension(f.FileName).ToLower()))
                    .WithMessage("Allowed formats: JPG, PNG, PDF, DOC, DOCX, XLSX, TXT, ZIP")
                .When(x => x.File != null && !x.IsPhoto);
        }
    }
}