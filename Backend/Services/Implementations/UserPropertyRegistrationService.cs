using Backend.Data;
using Backend.Helpers;
using Backend.Models.Dtos;
using Backend.Models.DTOs;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Data;

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
                //if (string.IsNullOrEmpty(dto.PropertyCode))
                //{
                //    dto.PropertyCode = await GeneratePropertyCode(dto.DistrictId, dto.BranchId, dto.MandiId, dto.PlotNo);
                //}
                var data = _context.UserPropertyRegistration.Where(x => x.AllotteeCode == dto.PropertyCode).FirstOrDefault();
                if (data != null)
                {
                    return ApiResponse<UserPropertyRegistrationDto>.Fail("Data already exists for this allottee code.");
                }

                var entity = new Models.Entities.UserPropertyRegistration
                {
                    MandiId = dto.MandiId,
                    BranchId = dto.BranchId,
                    DistrictId = dto.DistrictId,
                    AllotteeCode = dto.PropertyCode,
                    PlotTypeId = dto.PlotTypeId,
                    CreatedBy = dto.ApplicantId ?? 0,
                    PlotSize = dto.PlotSize,
                    PlotNo = dto.PlotNo,
                    AllotteeName = dto.CurrentOwnerName,
                    AllotteeEmail = dto.Email,
                    AllotteeFatherName = dto.FatherHusbandName,
                    PanNumber = dto.PanNumber,
                    AadharNumber = dto.AadhaarNumber,
                    AllotteeMobileNo = dto.MobileNumber,
                    AllotteeStateId = dto.OwnerStateID,
                    AllotteeDistrictId = dto.OwnerDistrtictID,
                    AllotteeCityId = dto.OwnerCityID,
                    AllotteeAddress = dto.Address,
                    IsActive=true
                };

                _context.UserPropertyRegistration.Add(entity);
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

        public async Task<ApiResponse<List<PlotSizesDto>>> GetMandiPlotSizeByPlotNoAsync(int mandiId, int plotTypeId, string plotNo)
        {
            try
            {
                var result = new List<PlotSizesDto>();

                await using var connection = _context.Database.GetDbConnection();

                if (connection.State != ConnectionState.Open)
                    await connection.OpenAsync();

                await using var command = connection.CreateCommand();

                command.CommandText = "sp_GetMandiPlotSizebyPlotNo";
                command.CommandType = CommandType.StoredProcedure;

                var mandiParam = command.CreateParameter();
                mandiParam.ParameterName = "@MandiId";
                mandiParam.Value = mandiId;
                command.Parameters.Add(mandiParam);

                var plotTypeParam = command.CreateParameter();
                plotTypeParam.ParameterName = "@PlotTypeId";
                plotTypeParam.Value = plotTypeId;
                command.Parameters.Add(plotTypeParam);

                var plotNoParam = command.CreateParameter();
                plotNoParam.ParameterName = "@PlotNo";
                plotNoParam.Value = plotNo;
                command.Parameters.Add(plotNoParam);

                await using var reader = await command.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    result.Add(new PlotSizesDto
                    {
                        PlotSize = reader["PlotSize"] == DBNull.Value ? null : reader["PlotSize"].ToString()
                    });
                }

                return ApiResponse<List<PlotSizesDto>>.Ok(  result,   result.Count > 0? "Plot size fetched successfully."  : "No plot size found."
                );
            }
            catch (Exception ex)
            {
                return ApiResponse<List<PlotSizesDto>>.Fail(  $"Error while fetching plot size: {ex.Message}"
                );
            }
        }
    }
}
