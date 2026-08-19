using Backend.Helpers;
using Backend.Models.Dtos;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class PropertyBidderRegnController : ControllerBase
    {
        private readonly IPropertyBidderRegistration _service;

        public PropertyBidderRegnController(IPropertyBidderRegistration service)
        {
            _service = service;
        }

        [HttpPost("registerProperty")]
        public async Task<IActionResult> RegisterProperty([FromBody] Models.Dtos.PropertyBidderRegistrationDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _service.RegisterPropertyAsync(dto);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpGet("getRegistrationById")]
        public async Task<IActionResult> GetRegistrationById(int id)
        {
            var response = await _service.GetRegistrationByIdAsync(id);
            if (!response.Success)
            {
                return NotFound(response);
            }

            return Ok(response);
        }

        [HttpGet("getAllPropertyRegistrations")]
        public async Task<IActionResult> GetAllRegistrations()
        {
            var response = await _service.GetAllRegistrationsAsync();
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpGet("search/{propertyCode}")]
        public async Task<IActionResult> GetRegistrationByPropertyCode(string propertyCode)
        {
            var response = await _service.GetRegistrationByPropertyCodeAsync(propertyCode);
            //if (!response.Success)
            //{
            //    if (response.Message == "no record found")
            //    {
            //        return NotFound(response);
            //    }
            //    return BadRequest(response);
            //}

            return Ok(response);
        }

        [HttpGet("GetPropertyEAuctionDetailsByPropertyCodeAsync/{propertyCode}")]
        public async Task <IActionResult> GetPropertyEAuctionDetailsByPropertyCodeAsync( string propertyCode)
        {
            var response = await _service.GetPropertyEAuctionDetailsByPropertyCodeAsync(propertyCode);
            //if (!response.Success)
            //{
            //    if (response.Message == "no record found")
            //    {
            //        return NotFound(response);
            //    }
            //    return BadRequest(response);
            //}

            return Ok(response);
        }
        [HttpPut("UpdateRegisterPropertyAsync")]
        public async Task<IActionResult> UpdateRegisterPropertyAsync([FromBody] PropertyBidderRegistrationDto dto)
        {
            if (dto.Id <= 0)
                return BadRequest("Invalid Property Id");

            var result = await _service.UpdateRegisterPropertyAsync(dto);

            if (!result.Success)
                return NotFound(result);

            return Ok(result);
        }
        [HttpGet("GetDistrictByHRMSUser")]
        public async Task<IActionResult> GetDistrictByHRMSUser()
        {
            var res = await _service.GetDistrictByHRMSUser(GetUserId());
            if (!res.Success)
            {
                return BadRequest(res);
            }
            return Ok(res);
        }

        [HttpGet("GetPendingForClerk")]
        public async Task<IActionResult> GetPendingForClerk([FromQuery] string? searchCode = null,int districtId =0, int branchId =0, int mandiid=0)
        {
            var response = await _service.GetPendingForClerk(GetUserId(),searchCode,districtId,branchId,mandiid);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpPost("VerifyByClerk")]
        public async Task<IActionResult> VerifyByClerk([FromBody] ClerkVerificationDto dto)
        {
            if (dto == null || dto.Id == 0)
            {
                return BadRequest(new ApiResponse
                {
                    Success = false,
                    Message = "Invalid request"
                });
            }

            var result = await _service.VerifyByClerk(dto);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
        private string GetUserId() =>
           User.FindFirstValue(ClaimTypes.NameIdentifier)
           ?? throw new UnauthorizedAccessException("Invalid token");
    }
}
