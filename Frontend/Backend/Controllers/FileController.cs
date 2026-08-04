using Backend.Helpers;
using Backend.Models.DTOs;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [Produces("application/json")]
    public class FileController : ControllerBase
    {
        private readonly IFileService _fileService;

        public FileController(IFileService fileService)
        {
            _fileService = fileService;
        }

        /// <summary>File upload (max 10MB)</summary>
        [HttpPost("upload")]
        [RequestSizeLimit(10 * 1024 * 1024)]
        public async Task<ActionResult<ApiResponse<FileUploadResponse>>> Upload(IFormFile file)
        {
            var result = await _fileService.UploadAsync(file, GetUserId());
            return Ok(ApiResponse<FileUploadResponse>.Ok(result, "File uploaded successfully"));
        }

        /// <summary>check all files</summary>
        [HttpGet("my-files")]
        public async Task<ActionResult<ApiResponse<IEnumerable<FileListResponse>>>> GetMyFiles()
        {
            var files = await _fileService.GetUserFilesAsync(GetUserId());
            return Ok(ApiResponse<IEnumerable<FileListResponse>>.Ok(files));
        }

        /// <summary>File download  by ID</summary>
        [HttpGet("download/{id:int}")]
        public async Task<IActionResult> Download(int id)
        {
            var (bytes, contentType, fileName) = await _fileService.DownloadAsync(id, GetUserId());
            return File(bytes, contentType, fileName);
        }

        /// <summary>File delete karo</summary>
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
