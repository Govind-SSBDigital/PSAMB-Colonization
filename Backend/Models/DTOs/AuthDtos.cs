using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Backend.Models.DTOs
{
    // ── REQUESTS ─────────────────────────────────────
    public class RegisterRequest
    {
        public int CategoryId { get; set; }

        public int Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string? LastName { get; set; }
        public int RelationType { get; set; } = 1;
        public string? FatherHusbandFirstName { get; set; }
        public string? FatherHusbandLastName { get; set; }
        public string? MotherFirstName { get; set; }
        public string? MotherLastName { get; set; }
        public string? SpouseFirstName { get; set; }
        public string? SpouseLastName { get; set; }
        public string Email { get; set; } = string.Empty;
        public string MobileNo { get; set; } = string.Empty;
        public int? IdentDocTypeId { get; set; }
        public string? IdentDocNumber { get; set; }
        public string? PANNumber { get; set; }
        public int? IndividualStateId { get; set; }
        public int? IndividualDistrictId { get; set; }
        public int? IndividualCityId { get; set; }
        public string? IndividualPinCode { get; set; }
        public string? IndividualPlotStreetLandmark { get; set; }
        public int? AddrDocTypeId { get; set; }
        public string? AddrDocNumber { get; set; }
        public string? FirmName { get; set; }
        public string? GSTNumber { get; set; }
        public string? MandiPropertyCode { get; set; }
        public bool? IsSameAsIndividualAddress { get; set; }
        public int? BusinessStateId { get; set; }
        public int? BusinessDistrictId { get; set; }
        public int? BusinessCityId { get; set; }
        public string? BusinessPinCode { get; set; }
        public string? BusinessPlotStreetLandmark { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        [JsonConverter(typeof(BoolConverter))]
        public bool IsHRMSOrUser { get; set; }
    }
    public class BoolConverter : JsonConverter<bool>
    {
        public override bool Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.Number)
                return reader.GetInt32() != 0;
            return reader.GetBoolean();
        }

        public override void Write(Utf8JsonWriter writer, bool value, JsonSerializerOptions options)
        {
            writer.WriteBooleanValue(value);
        }
    }
    public class MobileOtpLoginRequest
    {
        public string MobileNumber { get; set; } = string.Empty;
        public string Otp { get; set; } = string.Empty;
    }
    public class ChangePasswordRequest
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
        public string ConfirmNewPassword { get; set; } = string.Empty;
    }

    public class UpdateProfileRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
    }

    // ── RESPONSES ────────────────────────────────────
    public class UserResponse
    {
        public string Id { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public IList<string> Roles { get; set; } = new List<string>();
        public DateTime CreatedAt { get; set; }
        public string UserName { get; internal set; }
        public string MobileNo { get; internal set; }
    }

    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public UserResponse User { get; set; } = null!;
        public string UserId { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string EntityType { get; set; } = string.Empty;
        public bool IsFirstLogin { get; set; } = false;
    }
    public class verifydatamodel
    {
        public string? EmailId { get; set; }
        public string? MobileNumber { get; set; }
        public string? AdhaarNumber { get; set; }
        public string? VoterCard { get; set; }
        public string? Passport { get; set; }
        public string? DrivingLicenec { get; set; }
    }
    public class FirstLoginChangePasswordRequest
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
        public string ConfirmNewPassword { get; set; } = string.Empty;
    }
}
