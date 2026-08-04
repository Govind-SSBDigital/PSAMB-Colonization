using Backend.Data;
using Backend.Models.DTOs;
using Backend.Models.Entities;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Mail;

namespace Backend.Services.Implementations
{
    public class SendCredUserService : ISendCredUserService
    {
        private readonly ILogger<SendCredUserService> _logger;
        private readonly UserManager<IdentityApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly IMobileVerificationService _smsService;

        public SendCredUserService(
            ILogger<SendCredUserService> logger,
            UserManager<IdentityApplicationUser> userManager,
            IConfiguration configuration,
            ApplicationDbContext context,
            IMobileVerificationService smsService)
        {
            _logger = logger;
            _userManager = userManager;
            _configuration = configuration;
            _context = context;
            _smsService = smsService;
        }

        public async Task<bool> SendCredentialsAsync(SendCredModel model)
        {
            try
            {
                var emailSent = false;
                var smsSent = false;

                var emailSubject = "PSAMB Colonization Portal - Login Credentials";
                var emailBody = $@"
                    Dear User,

                    Your registration on PSAMB Colonization Portal is successful.

                    Your Login Credentials:
                    Username : {model.EmailId}
                    Password : {model.Password}

                    Please login at: https://dircolon.emandikaran-pb.in/auth/login

                    For security reasons, please change your password after first login.

                    Regards,
                    PSAMB Colonization Team
                    Punjab Mandi Board";

                var smsMessage = "Your OTP for login on IMS Portal is: " + model.Password + " -PSAMB";

                
                if (!string.IsNullOrEmpty(model.EmailId))
                {
                    try
                    {
                        await SendEmailAsync(model.EmailId, emailSubject, emailBody);
                        emailSent = true;
                        _logger.LogInformation("Credentials email sent to {Email}.", model.EmailId);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to send email to {Email}.", model.EmailId);
                    }
                }


                //if (!string.IsNullOrEmpty(model.MobileNumber))
                //{
                //    try
                //    {
                //        var smsBody = "Your PSAMB Portal credentials - Username: "
                //            + model.EmailId
                //            + " Password: "
                //            + model.Password
                //            + " -PSAMB";
                //        await _smsService.s(model.MobileNumber, smsBody);
                //        smsSent = true;
                //        _logger.LogInformation("Credentials SMS sent to {Mobile}.", model.MobileNumber);
                //    }
                //    catch (Exception ex)
                //    {
                //        _logger.LogError(ex, "Failed to send SMS to {Mobile}.", model.MobileNumber);
                //    }
                //}

                return emailSent; //|| smsSent;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending credentials to {Email}.", model.EmailId);
                return false;
            }
        }

        private async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var smtpHost = _configuration["EmailSptSettings:Host"];
            var smtpPort = int.Parse(_configuration["EmailSptSettings:Port"]!);
            var smtpUser = _configuration["EmailSptSettings:Username"];
            var smtpPass = _configuration["EmailSptSettings:Password"];

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                Credentials = new NetworkCredential(smtpUser, smtpPass),
                EnableSsl = true,
                UseDefaultCredentials = false
            };

            var message = new MailMessage(smtpUser!, toEmail)
            {
                Subject = subject,
                Body = body,
                IsBodyHtml = false
            };

            await client.SendMailAsync(message);
        }
    }
}