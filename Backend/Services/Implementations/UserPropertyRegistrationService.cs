using Backend.Data;
using Backend.Helpers;
using Backend.Models.Dtos;
using Backend.Models.DTOs;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Implementations
{
    public class UserPropertyRegistrationService: IUserPropertyRegistrationService
    {


        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        public UserPropertyRegistrationService(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }
        private async Task<string> GeneratePropertyCode(int districtId, int mandiMarketId, int mandiId, int? plotNo)
        {
            var districtName = await _context.DistrictMasters.Where(x => x.DistrictId == districtId).Select(x => x.DistrictName).FirstOrDefaultAsync();

            var mandiMarketName = await _context.BranchMaster.Where(x => x.BranchId == mandiMarketId).Select(x => x.BranchName).FirstOrDefaultAsync();

            var mandiName = await _context.MandiMaster.Where(x => x.MandiId == mandiId).Select(x => x.MandiName).FirstOrDefaultAsync();

            var districtLetter = !string.IsNullOrEmpty(districtName) ? districtName.Substring(0, 1).ToUpper() : "";
            var mandimarketLetter = !string.IsNullOrEmpty(mandiMarketName) ? mandiMarketName.Substring(0, 1).ToUpper() : "";
            var mandiLetter = !string.IsNullOrEmpty(mandiName) ? mandiName.Substring(0, 1).ToUpper() : "";

            var lastCode = await _context.PropertyBidderRegistration.OrderByDescending(x => x.Id)
                .Select(x => x.PropertyCode)
                .FirstOrDefaultAsync();

            int series = 1;

            if (!string.IsNullOrEmpty(lastCode))
            {
                var lastSeries = int.Parse(lastCode.Split('-').Last());
                series = lastSeries + 1;
            }

            return $"{districtLetter}{mandimarketLetter}{mandiLetter}{plotNo}-{series}";
        }
        public async Task<ApiResponse<UserPropertyRegistrationDto>> UserPropertyRegisterAsync(UserPropertyRegistrationDto dto)
        {
            try
            {
                if (string.IsNullOrEmpty(dto.PropertyCode))
                {
                    dto.PropertyCode = await GeneratePropertyCode(dto.DistrictId, dto.BranchId, dto.MandiId, dto.PlotNo);
                }
                //var data = _context.PropertyBidderRegistration.Where(x => x.PropertyCode == dto.PropertyCode).FirstOrDefault();
                //if (data != null)
                //{
                //    return ApiResponse<UserPropertyRegistrationDto>.Fail("Data already exists for this allottee code.");
                //}

                var entity = new Models.Entities.PropertyBidderRegistration
                {
                    MandiId = dto.MandiId,
                    BranchId = dto.BranchId,
                    DistrictId = dto.DistrictId,
                    PropertyCode = dto.PropertyCode,
                    PlotTypeId = dto.PlotTypeId,
                    ApplicantId = dto.ApplicantId ?? 0,
                    PlanId = dto.PlanId,
                    PlotSize = dto.PlotSize,
                    PlotNo = dto.PlotNo,
                    BidderName = dto.CurrentOwnerName,
                    Email = dto.Email,
                    FatherOrHusbandName = dto.FatherHusbandName,
                    PANNo = dto.PanNumber,
                    AadhaarNo = dto.AadhaarNumber,
                    MobileNo = dto.MobileNumber,
                    OwnerStateID = dto.OwnerStateID,
                    OwnerDistrtictID = dto.OwnerDistrtictID,
                    OwnerCityID = dto.OwnerCityID,
                    Address = dto.Address,
                    IsUser = true
                };

                _context.PropertyBidderRegistration.Add(entity);
                await _context.SaveChangesAsync();

                return ApiResponse<UserPropertyRegistrationDto>.Ok(dto, "Property registered successfully");
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                if (ex.InnerException != null)
                {
                    message += " | Inner: " + ex.InnerException.Message;
                    if (ex.InnerException.InnerException != null)
                    {
                        message += " | Detail: " + ex.InnerException.InnerException.Message;
                    }
                }
                return ApiResponse<UserPropertyRegistrationDto>.Fail(message);
            }
        }
    }
}
