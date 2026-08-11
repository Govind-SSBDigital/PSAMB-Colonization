// Validators/Auth/LoginRequestValidator.cs
using Backend.Models.DTOs;
using FluentValidation;

namespace Backend.Validators.Auth
{
    public class LoginRequestValidator : AbstractValidator<LoginRequest>
    {
        public LoginRequestValidator()
        {
            //RuleFor(x => x.Email)
            //    .NotEmpty().WithMessage("Email is required")
            //    .EmailAddress().WithMessage("Please enter a valid email address");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(8).WithMessage("Password must be at least 8 characters");
        }
    }
}