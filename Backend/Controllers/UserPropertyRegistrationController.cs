using Backend.Helpers;
using Backend.Models.Dtos;
using Backend.Models.DTOs;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserPropertyRegistrationController : ControllerBase
    {
        private readonly IUserPropertyRegistrationService _service;

        public UserPropertyRegistrationController(IUserPropertyRegistrationService service)
        {
            _service = service;
        }

        [HttpPost("UserPropertyRegistration")]
        public async Task<IActionResult> UserPropertyRegistrationAsync([FromBody] UserPropertyRegistrationDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _service.UserPropertyRegisterAsync(dto);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpGet("GetMandiPlotSizeByPlotNo")]
        public async Task<IActionResult> GetMandiPlotSizeByPlotNo([FromQuery] int mandiId, [FromQuery] int plotTypeId, [FromQuery] string plotNo)
        {
            try
            {
                var response = await _service.GetMandiPlotSizeByPlotNoAsync(mandiId,plotTypeId,plotNo);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    ApiResponse<List<PlotSizeDto>>.Fail(
                        $"Error while fetching plot size: {ex.Message}"));
            }
        }
    }
}
