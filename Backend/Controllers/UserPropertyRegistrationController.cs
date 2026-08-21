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
    }
}
