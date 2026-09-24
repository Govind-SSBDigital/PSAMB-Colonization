using Backend.Helpers;
using Backend.Models.DTOs;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class FileController : ControllerBase
    {
        private readonly IFileService _fileService;

        public FileController(IFileService fileService)
        {
            _fileService = fileService;
        }

        [HttpPost("upload")]
        [RequestSizeLimit(5 * 1024 * 1024)]
        public async Task<ActionResult<ApiResponse<FileUploadResponse>>> Upload(
             [FromForm] FileUploadRequest request)
        {
            try
            {
                if (request.File == null || request.File.Length == 0)
                    return BadRequest("Please select a file.");

                if (string.IsNullOrWhiteSpace(request.SessionId))
                    return BadRequest("SessionId is required.");

                var result = await _fileService.UploadAsync(
                    request.File,
                    request.DocumentCategoryId,
                    request.DocumentTypeId,
                    request.DocumentNumber,
                    request.SessionId);

                return Ok(ApiResponse<FileUploadResponse>.Ok(result, "File uploaded successfully"));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    "An error occurred while uploading the file.");
            }
        }
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<ApiResponse>> Delete(int id)
        {
            await _fileService.DeleteAsync(id, GetUserId());
            return Ok(ApiResponse.Ok("File deleted successfully"));
        }

        private string GetUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("Invalid token");
    }
}
