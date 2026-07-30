// Validators/Auth/UpdateProfileRequestValidator.cs
using Backend.Models.DTOs;
using FluentValidation;

namespace Backend.Validators.Auth
{
    public class UpdateProfileRequestValidator : AbstractValidator<UpdateProfileRequest>
    {
        public UpdateProfileRequestValidator()
        {
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Full name is required")
                .MaximumLength(200).WithMessage("Full name cannot exceed 200 characters")
                .Matches(@"^[a-zA-Z\s]+$").WithMessage("Full name must contain letters only");

            RuleFor(x => x.PhoneNumber)
                .Matches(@"^[6-9][0-9]{9}$")
                    .WithMessage("Please enter a valid 10-digit Indian mobile number")
                .When(x => !string.IsNullOrEmpty(x.PhoneNumber));
        }
    }
}