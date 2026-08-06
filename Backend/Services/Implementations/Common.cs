using Backend.Data;
using Backend.Helpers;
using Backend.Models.Dtos;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Windows.Input;
using static Azure.Core.HttpHeader;
using static Backend.Models.Dtos.DistrictMasterDto;

namespace Backend.Services.Implementations
{
    public class Common : ICommon
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        public Common(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<ApiResponse<List<StateDto>>> GetAllStates()
        {
            try
            {
                var states = await _context.StateMasters
                    .Where(x => x.IsActive && !x.IsDeleted)
                    .Select(x => new StateDto
                    {
                        StateId = x.StateId,
                        StateName = x.StateName
                    })
                    .ToListAsync();

                if (states == null || states.Count == 0)
                {
                    return ApiResponse<List<StateDto>>.Fail("No states found");
                }

                return ApiResponse<List<StateDto>>.Ok(states, "States fetched successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<List<StateDto>>.Fail(ex.Message);
            }
        }

        public async Task<List<DistrictDto>> GetAllDistrictsAsync()
        {
            try
            {
                var districts = await _context.DistrictMasters.Where(x => x.IsActive == true && x.StateId == 1).ToListAsync();

                return districts.Select(x => new DistrictDto
                {
                    DistrictId = x.DistrictId,
                    DistrictName = x.DistrictName,
                    DistrictCode = x.DistrictCode,
                    DistrictPunjabiName = x.DistrictPunjabiName
                }).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching districts", ex);
            }
        }

        public async Task<ApiResponse<List<MarketCommitteeDto>>> GetMarketCommitteesAsync(int? districtId)
        {
            try
            {
                var query = _context.BranchMaster.AsNoTracking().Where(x => x.DistrictId == districtId && x.IsActive && !x.IsDeleted);

                var list = await query
                    .Select(x => new MarketCommitteeDto
                    {
                        BranchId = x.BranchId,
                        BranchName = x.BranchName,
                        DistrictId = x.DistrictId,
                        RoleId = x.RoleId,
                        BranchCode = x.BranchCode
                    }).ToListAsync();

                return ApiResponse<List<MarketCommitteeDto>>.Ok(list, "Market Committees fetched successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<List<MarketCommitteeDto>>.Fail(ex.Message);
            }
        }

        public async Task<ApiResponse<List<MandiDto>>> GetMandisByMarketCommiteeByDistrictAsync(int branchID)
        {
            try
            {
                var list = await (from b in _context.BranchMaster
                                  join ba in _context.BranchMandiAssociation on b.BranchId equals ba.BranchId
                                  join m in _context.MandiMaster on ba.MandiId equals m.MandiId
                                  where b.BranchId == branchID && b.IsActive && !b.IsDeleted && m.IsActive && !m.IsDeleted
                                  select new MandiDto
                                  {
                                      MandiId = m.MandiId,
                                      DistrictId = m.DistrictId,
                                      MandiName = m.MandiName,
                                      MandiCode = m.MandiCode
                                  }
                    ).Distinct().ToListAsync();


                return ApiResponse<List<MandiDto>>.Ok(list, "Mandi fetched successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<List<MandiDto>>.Fail(ex.Message);
            }
        }

        public async Task<ApiResponse<List<PlotTypeDto>>> GetPlotTypesAsync(int? propertyTypeId)
        {
            try
            {
                var query = _context.PlotTypeMaster.AsNoTracking().Where(x => x.IsActive == true && x.IsDeleted != true);

                if (propertyTypeId.HasValue)
                {
                    query = query.Where(x => x.PropertyTypeId == propertyTypeId.Value);
                }

                var list = await query.Select(x => new PlotTypeDto
                {
                    PlotTypeId = x.PlotTypeId,
                    PlotType = x.PlotType,
                    PropertyTypeId = x.PropertyTypeId
                })
                    .ToListAsync();

                return ApiResponse<List<PlotTypeDto>>.Ok(list, "Plot types fetched successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<List<PlotTypeDto>>.Fail(ex.Message);
            }
        }

        public async Task<ApiResponse<List<PlotSizeDto>>> GetPlotSizesAsync()
        {
            try
            {
                var list = await _context.PlotSizeMaster.AsNoTracking().Where(x => x.IsActive == true && x.IsDeleted != true).Select(x => new PlotSizeDto
                {
                    PlotSizeId = x.PlotSizeId,
                    PlotSize = x.PlotSize
                })
                    .ToListAsync();

                return ApiResponse<List<PlotSizeDto>>.Ok(list, "Plot sizes fetched successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<List<PlotSizeDto>>.Fail(ex.Message);
            }
        }

        public async Task<ApiResponse<List<PlanDto>>> GetPlansAsync()
        {
            try
            {
                var list = await _context.PlanMaster.AsNoTracking().Where(x => x.IsActive == true && x.IsDeleted != true).Select(x => new PlanDto
                {
                    PlanId = x.PlanId,
                    PlanName = x.PlanName,
                    PlanSanctionDate = x.PlanSanctionDate
                })
                    .ToListAsync();

                return ApiResponse<List<PlanDto>>.Ok(list, "Plans fetched successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<List<PlanDto>>.Fail(ex.Message);
            }
        }

        public async Task<ApiResponse<List<PropertyTypeDto>>> GetPropertyTypesAsync()
        {
            try
            {
                var list = await _context.PropertyType.AsNoTracking().Where(x => x.IsActive && !x.IsDeleted).Select(x => new PropertyTypeDto
                {
                    PropertyTypeId = x.PropertyTypeId,
                    PropertyTypeName = x.PropertyTypeName
                })
                    .ToListAsync();

                return ApiResponse<List<PropertyTypeDto>>.Ok(list, "Property types fetched successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<List<PropertyTypeDto>>.Fail(ex.Message);
            }
        }

        public async Task<ApiResponse<List<BidderTypeDto>>> GetBidderTypesAsync()
        {
            try
            {
                var list = await _context.BidderTypeMaster.AsNoTracking().Where(x => x.IsActive && !x.IsDeleted).Select(x => new BidderTypeDto
                {
                    BidderTypeId = x.BidderTypeId,
                    BidderTypeName = x.BidderTypeName
                })
                    .ToListAsync();

                return ApiResponse<List<BidderTypeDto>>.Ok(list, "Bidder types fetched successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<List<BidderTypeDto>>.Fail(ex.Message);
            }
        }

        public async Task<ApiResponse<List<ApplicationStatusDto>>> GetApplicationStatusesAsync()
        {
            try
            {
                var list = await _context.ApplicationStatusMaster.AsNoTracking().Where(x => x.IsActive && !x.IsDeleted).Select(x => new ApplicationStatusDto
                {
                    ApplicationStatusId = x.ApplicationStatusId,
                    ApplicationStatusName = x.ApplicationStatusName
                })
                    .ToListAsync();

                return ApiResponse<List<ApplicationStatusDto>>.Ok(list, "Application statuses fetched successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<List<ApplicationStatusDto>>.Fail(ex.Message);
            }
        }

        public async Task<ApiResponse<List<PropertyCategoryDto>>> GetPropertyCategoriesAsync()
        {
            try
            {
                var list = await _context.PropertyCategoryMaster.AsNoTracking()
                    .Where(x => x.IsActive && !x.IsDeleted)
                    .Select(x => new PropertyCategoryDto
                    {
                        PropertyCategoryId = x.PropertyCategoryId,
                        CategoryName = x.CategoryName
                    })
                    .ToListAsync();

                return ApiResponse<List<PropertyCategoryDto>>.Ok(list, "Property categories fetched successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<List<PropertyCategoryDto>>.Fail(ex.Message);
            }
        }
    }
}
