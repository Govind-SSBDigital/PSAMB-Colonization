using Backend.Data;
using Backend.Helpers;
using Backend.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class LocationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LocationController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET api/Location/states
        [HttpGet("states")]
        public async Task<ActionResult<ApiResponse<List<StateResponse>>>> GetStates()
        {
            var states = await _context.StateMasters
                .Where(x => x.IsDeleted == false && x.IsActive == true)
                .OrderBy(x => x.StateName)
                .Select(x => new StateResponse
                {
                    StateId = x.StateId,
                    StateName = x.StateName,
                    StateCode = x.StateCode
                })
                .ToListAsync();

            return Ok(ApiResponse<List<StateResponse>>.Ok(states));
        }

        // GET api/Location/districts/1
        [HttpGet("districts/{stateId}")]
        public async Task<ActionResult<ApiResponse<List<DistrictResponse>>>> GetDistricts(int stateId)
        {
            var districts = await _context.DistrictMasters
                .Where(x => x.StateId == stateId
                    && x.IsDeleted == false
                    && x.IsActive == true)
                .OrderBy(x => x.DistrictName)
                .Select(x => new DistrictResponse
                {
                    DistrictId = x.DistrictId,
                    StateId = x.StateId,
                    DistrictName = x.DistrictName,
                    DistrictCode = x.DistrictCode,
                    DistrictPunjabiName = x.DistrictPunjabiName
                })
                .ToListAsync();

            return Ok(ApiResponse<List<DistrictResponse>>.Ok(districts));
        }

        // GET api/Location/cities/1
        [HttpGet("cities/{districtId}")]
        public async Task<ActionResult<ApiResponse<List<CityResponse>>>> GetCities(int districtId)
        {
            var cities = await _context.CityMasters
                .Where(x => x.DistrictId == districtId
                    && x.IsDeleted == false
                    && x.IsActive == true)
                .OrderBy(x => x.CityName)
                .Select(x => new CityResponse
                {
                    CityId = x.CityId,
                    DistrictId = x.DistrictId,
                    CityName = x.CityName,
                    CityCode = x.CityCode,
                    IsTehsil = x.IsTehsil
                })
                .ToListAsync();

            return Ok(ApiResponse<List<CityResponse>>.Ok(cities));
        }
    }
}