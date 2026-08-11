using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailVerificationController : ControllerBase
    {
        private readonly IEmailVerificationService _emailService;

        public EmailVerificationController(IEmailVerificationService emailService)
        {
            _emailService = emailService;
        }


            public class EmailSendOtpRequest
            {
                public string Email { get; set; } = string.Empty;
            }

            public class EmailVerifyOtpRequest
            {
                public string Email { get; set; } = string.Empty;
                public string Otp { get; set; } = string.Empty;
            }

            [HttpPost("send-otp")]
            public async Task<IActionResult> SendOtp([FromBody] EmailSendOtpRequest req)
            {
                try
                {
                    await _emailService.SendOtpAsync(req.Email);
                    return Ok(new { success = true, message = "OTP sent successfully" });
                }
                catch (Exception ex)
                {
                    return Ok(new { success = false, message = ex.Message });
                }
            }

            [HttpPost("verify-otp")]
            public async Task<IActionResult> VerifyOtp([FromBody] EmailVerifyOtpRequest req)
            {
                var verified = await _emailService.VerifyOtpAsync(req.Email, req.Otp);
                return Ok(new { success = true, verified, message = verified ? "Verified" : "Invalid OTP" });
            }

            [HttpPost("resend-otp")]
            public async Task<IActionResult> ResendOtp([FromBody] EmailSendOtpRequest req)
            {
                await _emailService.SendOtpAsync(req.Email);
                return Ok(new { success = true, message = "OTP resent" });
            }
        }
    }