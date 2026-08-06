using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommonController : ControllerBase
    {
        private readonly ICommon _common;

        public CommonController(ICommon common)
        {
            _common = common;
        }

        [HttpGet("getAllDistrict")]
        public async Task<IActionResult> GetAllDistrict()
        {
            try
            {
                var result = await _common.GetAllDistrictsAsync();

                return Ok(new
                {
                    success = true,
                    data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [HttpGet("getAllStates")]
        public async Task<IActionResult> GetAllStates()
        {
            var response = await _common.GetAllStates();

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpGet("getMarketCommittees")]
        public async Task<IActionResult> GetMarketCommittees(int? districtId)
        {
            var response = await _common.GetMarketCommitteesAsync(districtId);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpGet("GetMandisByMarketCommiteeByDistrictAsync")]
        public async Task<IActionResult> GetMandisByMarketCommiteeByDistrictAsync(int branchID)
        {
            var response = await _common.GetMandisByMarketCommiteeByDistrictAsync(branchID);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpGet("getPlotTypes")]
        public async Task<IActionResult> GetPlotTypes(int? propertyTypeId)
        {
            var response = await _common.GetPlotTypesAsync(propertyTypeId);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpGet("getPlotSizes")]
        public async Task<IActionResult> GetPlotSizes()
        {
            var response = await _common.GetPlotSizesAsync();
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpGet("getPlans")]
        public async Task<IActionResult> GetPlans()
        {
            var response = await _common.GetPlansAsync();
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpGet("getPropertyTypes")]
        public async Task<IActionResult> GetPropertyTypes()
        {
            var response = await _common.GetPropertyTypesAsync();
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpGet("getBidderTypes")]
        public async Task<IActionResult> GetBidderTypes()
        {
            var response = await _common.GetBidderTypesAsync();
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpGet("getApplicationStatuses")]
        public async Task<IActionResult> GetApplicationStatuses()
        {
            var response = await _common.GetApplicationStatusesAsync();
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpGet("getPropertyCategories")]
        public async Task<IActionResult> GetPropertyCategories()
        {
            var response = await _common.GetPropertyCategoriesAsync();
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
    }
}
