using Backend.Helpers;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Caching.Memory;
using System.Net.Http;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class MobileVerificationController : ControllerBase
    {
        private readonly IMobileVerificationService _mobileService;
        private readonly IMemoryCache _cache;
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public MobileVerificationController(IMobileVerificationService mobileService, IMemoryCache cache, IConfiguration config,
            IHttpClientFactory httpClientFactory)
        {
            _mobileService = mobileService;
            _cache = cache;
            _httpClient = httpClientFactory.CreateClient();
            _config = config;

        }
        [HttpPost("send-mobile-otp")]
        public async Task<ActionResult<ApiResponse>> SendMobileOtp(
    [FromBody] SendMobileOtpRequest request)
        {
            if (string.IsNullOrEmpty(request.MobileNumber) ||
                request.MobileNumber.Length != 10)
                return BadRequest(ApiResponse.Fail("Invalid mobile number"));

            var otp = new Random().Next(100000, 999999).ToString();
            var message = "Your OTP for login on IMS Portal is: " + otp + " -PSAMB";

            var result = await _mobileService.SendSmsAsync(
                request.MobileNumber, message, otp, 0);

            if (!result)
                return BadRequest(ApiResponse.Fail("Failed to send OTP"));

            return Ok(ApiResponse.Ok("OTP sent successfully"));
        }

        [HttpPost("verify-mobile-otp")]
        public async Task<ActionResult<ApiResponse>> VerifyMobileOtp(
            [FromBody] VerifyMobileOtpRequest request)
        {
            var isValid = await _mobileService.VerifyOtpAsync(
                request.MobileNumber, request.Otp);

            if (!isValid)
                return BadRequest(ApiResponse.Fail("Invalid or expired OTP"));

            return Ok(ApiResponse.Ok("Mobile verified successfully"));
        }
    }
    public class SendMobileOtpRequest
    {
        public string MobileNumber { get; set; } = string.Empty;
    }

    public class VerifyMobileOtpRequest
    {
        public string MobileNumber { get; set; } = string.Empty;
        public string Otp { get; set; } = string.Empty;
    }
}