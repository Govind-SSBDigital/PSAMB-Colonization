using Backend.Data;
using Backend.Models.Entities;
using Backend.Services.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using System.Net;
using System.Net.Mail;

namespace Backend.Services.Implementations
{
    public class EmailVerificationService : IEmailVerificationService
    {
        private readonly IMemoryCache _cache;
        private readonly IConfiguration _config;
        private readonly ApplicationDbContext _context;

        public EmailVerificationService(
            IMemoryCache cache,
            IConfiguration config,
            ApplicationDbContext context)
        {
            _cache = cache;
            _config = config;
            _context = context;
        }

        public async Task<bool> SendOtpAsync(string email)
        {
            var otp = new Random().Next(100000, 999999).ToString();

            _cache.Set($"otp_{email}", otp, TimeSpan.FromMinutes(5));
            var emailOtp = new EmailOtp
            {
                Email = email,
                OTP = otp,
                IsUsed = false,
                CreatedAt = DateTime.Now
            };
            await _context.EmailOtps.AddAsync(emailOtp);
            await _context.SaveChangesAsync();

            var smtpHost = _config["EmailSptSettings:Host"];
            var smtpPort = int.Parse(_config["EmailSptSettings:Port"]!);
            var smtpUser = _config["EmailSptSettings:Username"];
            var smtpPass = _config["EmailSptSettings:Password"];

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                Credentials = new NetworkCredential(smtpUser, smtpPass),
                EnableSsl = true,
                UseDefaultCredentials = false
            };

            var message = new MailMessage(smtpUser!, email)
            {
                Subject = "Your Verification OTP - PSAMB",
                Body = $"Your OTP for email verification is: {otp}. Valid for 5 minutes. Do not share with anyone.",
                IsBodyHtml = false
            };

            await client.SendMailAsync(message);
            return true;
        }

        public async Task<bool> VerifyOtpAsync(string email, string otp)
        {
            if (_cache.TryGetValue($"otp_{email}", out string? storedOtp) && storedOtp == otp)
            {
                _cache.Remove($"otp_{email}");

                var emailOtp = _context.EmailOtps
                    .Where(x => x.Email == email
                        && x.OTP == otp
                        && x.IsUsed == false
                        && x.CreatedAt >= DateTime.Now.AddMinutes(-5))
                    .OrderByDescending(x => x.CreatedAt)
                    .FirstOrDefault();

                if (emailOtp != null)
                {
                    emailOtp.IsUsed = true;
                    await _context.SaveChangesAsync();
                }

                return true;
            }

            var dbOtp = _context.EmailOtps
                .Where(x => x.Email == email
                    && x.OTP == otp
                    && x.IsUsed == false
                    )
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefault();

            if (dbOtp != null)
            {
                dbOtp.IsUsed = true;
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }
    }
}