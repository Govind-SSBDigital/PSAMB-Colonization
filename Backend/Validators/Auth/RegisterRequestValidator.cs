// Validators/Auth/RegisterRequestValidator.cs
using Backend.Models.DTOs;
using FluentValidation;

namespace Backend.Validators.Auth
{
    public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
    {
        public RegisterRequestValidator()
        {
            RuleFor(x => x.CategoryId)
                .GreaterThan(0).WithMessage("Please select a category");

            RuleFor(x => x.Gender)
                .GreaterThan(0).WithMessage("Please select a gender");

            RuleFor(x => x.DateOfBirth)
                .NotEmpty().WithMessage("Date of birth is required")
                .LessThan(DateTime.Today).WithMessage("Please enter a valid date of birth")
                .GreaterThan(DateTime.Today.AddYears(-100))
                    .WithMessage("Please enter a valid date of birth");

            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("First name is required")
                .MaximumLength(200).WithMessage("First name cannot exceed 200 characters")
                .Matches(@"^[a-zA-Z\s]+$").WithMessage("First name must contain letters only");

            RuleFor(x => x.LastName)
                .MaximumLength(100).WithMessage("Last name cannot exceed 100 characters")
                .Matches(@"^[a-zA-Z\s]+$").WithMessage("Last name must contain letters only")
                .When(x => !string.IsNullOrEmpty(x.LastName));

            //RuleFor(x => x.FatherHusbandFirstName)
            //    .NotEmpty().WithMessage("Father/Husband first name is required")
            //    .MaximumLength(200).WithMessage("Name cannot exceed 200 characters")
            //    .Matches(@"^[a-zA-Z\s]+$").WithMessage("Name must contain letters only");

            //RuleFor(x => x.MotherFirstName)
            //    .NotEmpty().WithMessage("Mother first name is required")
            //    .MaximumLength(200).WithMessage("Name cannot exceed 200 characters")
            //    .Matches(@"^[a-zA-Z\s]+$").WithMessage("Name must contain letters only");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Please enter a valid email address")
                .MaximumLength(255).WithMessage("Email cannot exceed 255 characters");

            RuleFor(x => x.MobileNo)
                .NotEmpty().WithMessage("Mobile number is required")
                .Matches(@"^[6-9][0-9]{9}$")
                    .WithMessage("Please enter a valid 10-digit Indian mobile number");

            //RuleFor(x => x.Password)
            //    .NotEmpty().WithMessage("Password is required")
            //    .MinimumLength(8).WithMessage("Password must be at least 8 characters")
            //    .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter")
            //    .Matches("[a-z]").WithMessage("Password must contain at least one lowercase letter")
            //    .Matches("[0-9]").WithMessage("Password must contain at least one number")
            //    .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain at least one special character");

            //RuleFor(x => x.ConfirmPassword)
            //    .NotEmpty().WithMessage("Confirm password is required")
            //    .Equal(x => x.Password).WithMessage("Passwords do not match");

            //RuleFor(x => x.IdentDocTypeId)
            //    .GreaterThan(0).WithMessage("Please select a document type")
            //    .When(x => x.IdentDocTypeId.HasValue);

            RuleFor(x => x.IdentDocNumber)
                .NotEmpty().WithMessage("Document number is required")
                .MaximumLength(100).WithMessage("Document number cannot exceed 100 characters")
                .When(x => x.IdentDocTypeId.HasValue && x.IdentDocTypeId > 0);

            RuleFor(x => x.PANNumber)
                .Matches(@"^[A-Z]{5}[0-9]{4}[A-Z]{1}$")
                    .WithMessage("Please enter a valid PAN number (e.g. ABCDE1234F)")
                .When(x => !string.IsNullOrEmpty(x.PANNumber));

            RuleFor(x => x.IndividualStateId)
                .GreaterThan(0).WithMessage("Please select a state")
                .When(x => x.IndividualStateId.HasValue);

            RuleFor(x => x.IndividualDistrictId)
                .GreaterThan(0).WithMessage("Please select a district")
                .When(x => x.IndividualDistrictId.HasValue);

            //RuleFor(x => x.IndividualCityId)
            //    .GreaterThan(0).WithMessage("Please select a city")
            //    .When(x => x.IndividualCityId.HasValue);

            //RuleFor(x => x.IndividualPinCode)
            //    .Matches(@"^[0-9]{6}$").WithMessage("Please enter a valid 6-digit pin code")
            //    .When(x => !string.IsNullOrEmpty(x.IndividualPinCode));

            RuleFor(x => x.AddrDocNumber)
                .NotEmpty().WithMessage("Address document number is required")
                .MaximumLength(100).WithMessage("Document number cannot exceed 100 characters")
                .When(x => x.AddrDocTypeId.HasValue && x.AddrDocTypeId > 0);

            RuleFor(x => x.FirmName)
                .NotEmpty().WithMessage("Firm name is required")
                .MaximumLength(250).WithMessage("Firm name cannot exceed 250 characters")
                .When(x => x.CategoryId == 2);

            RuleFor(x => x.GSTNumber)
                .Matches(@"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")
                    .WithMessage("Please enter a valid GST number (e.g. 22ABCDE1234F1Z5)")
                .When(x => x.CategoryId == 2 && !string.IsNullOrEmpty(x.GSTNumber));

            RuleFor(x => x.BusinessPinCode)
                .Matches(@"^[0-9]{6}$").WithMessage("Please enter a valid 6-digit business pin code")
                .When(x => x.CategoryId == 2
                    && x.IsSameAsIndividualAddress == false
                    && !string.IsNullOrEmpty(x.BusinessPinCode));

            RuleFor(x => x.BusinessStateId)
                .GreaterThan(0).WithMessage("Please select a business state")
                .When(x => x.CategoryId == 2 && x.IsSameAsIndividualAddress == false);

            RuleFor(x => x.BusinessDistrictId)
                .GreaterThan(0).WithMessage("Please select a business district")
                .When(x => x.CategoryId == 2 && x.IsSameAsIndividualAddress == false);

            RuleFor(x => x.BusinessCityId)
                .GreaterThan(0).WithMessage("Please select a business city")
                .When(x => x.CategoryId == 2 && x.IsSameAsIndividualAddress == false);
        }
    }
}