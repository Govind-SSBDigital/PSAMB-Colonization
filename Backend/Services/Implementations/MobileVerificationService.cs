using Azure.Core;
using Backend.Data;
using Backend.Models.Entities;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Net.Http;
using System.Text;

namespace Backend.Services.Implementations
{
    public class MobileVerificationService : IMobileVerificationService
    {
        private readonly IMemoryCache _cache;
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;
        private readonly ILogger<MobileVerificationService> _logger;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ApplicationDbContext _context;
        public MobileVerificationService(IMemoryCache cache, IConfiguration config, HttpClient httpClient, ILogger<MobileVerificationService> logger, ApplicationDbContext context
            , IHttpClientFactory httpClientFactory)
        {

            _cache = cache;
            _config = config;
            _httpClient = httpClient;
            _logger = logger;
            _httpClientFactory = httpClientFactory;
            _context = context;
        }
        public async Task<bool> SendSmsAsync(string mobileNo, string message, string otp, long applicantId)
        {
            try
            {
                
                var mobileOtp = new MobileOTPs
                {
                    ApplicantId = applicantId,
                    MobileNumber = mobileNo,
                    OTP = otp,
                    IsUsed = false,
                    CreatedAt = DateTime.Now
                };
                await _context.MobileOTPs.AddAsync(mobileOtp);
                await _context.SaveChangesAsync();

               
                if (!mobileNo.StartsWith("91"))
                    mobileNo = "91" + mobileNo;

                string requestUrl = "https://api.onex-aura.com/api/sms?key=vFhwd8sy&to="
                    + mobileNo
                    + "&from=PMBSMS&body="
                    + message
                    + "&entityid=1001395680000010147&templateid=1007166920052959008";         //1007166920052959008              1007169087211671887

                _logger.LogInformation("SMS 1007166920052959008: {Url}", requestUrl);

                var response = await _httpClient.GetAsync(requestUrl);
                var responseBody = await response.Content.ReadAsStringAsync();

                _logger.LogInformation("SMS Response: {Response}", responseBody);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SMS failed for {MobileNo}", mobileNo);
                return false;
            }
        }
        //public async Task<bool> SendCredAsync(string mobileNo, string message,string Password)
        //{
        //    try
        //    {

        //        var mobileOtp = new MobileOTPs
        //        {
        //            ApplicantId = applicantId,
        //            MobileNumber = mobileNo,
        //            OTP = otp,
        //            IsUsed = false,
        //            CreatedAt = DateTime.Now
        //        };
        //        await _context.MobileOTPs.AddAsync(mobileOtp);
        //        await _context.SaveChangesAsync();


        //        if (!mobileNo.StartsWith("91"))
        //            mobileNo = "91" + mobileNo;

        //        string requestUrl = "https://api.onex-aura.com/api/sms?key=vFhwd8sy&to="
        //            + mobileNo
        //            + "&from=PMBSMS&body="
        //            + message
        //            + "&entityid=1001395680000010147&templateid=1007166920052959008";         //1007166920052959008              1007169087211671887

        //        _logger.LogInformation("SMS 1007166920052959008: {Url}", requestUrl);

        //        var response = await _httpClient.GetAsync(requestUrl);
        //        var responseBody = await response.Content.ReadAsStringAsync();

        //        _logger.LogInformation("SMS Response: {Response}", responseBody);
        //        return true;
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "SMS failed for {MobileNo}", mobileNo);
        //        return false;
        //    }
        //}

        public async Task<bool> VerifyOtpAsync(string mobileNo, string otp)
        {
            var userOtp = await _context.MobileOTPs
                .Where(x => x.MobileNumber == mobileNo
                    && x.OTP == otp
                    && x.IsUsed == false
                    && x.CreatedAt >= DateTime.Now.AddMinutes(-5))
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync();

            if (userOtp == null)
                return false;

            // Used mark karo
            userOtp.IsUsed = true;
            await _context.SaveChangesAsync();

            return true;
        }

    }
}
