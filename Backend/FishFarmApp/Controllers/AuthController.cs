using App.Application.DTOs;
using App.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FishFarmApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IUserService userService) : ControllerBase
    {
        private readonly IUserService _userService = userService;

        [Authorize]
        [HttpGet("me")]

        public async Task<ActionResult<UserResponseDto>> GetCurrentUser() {

            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            if (string.IsNullOrWhiteSpace(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
                return Unauthorized(new { message = "Invalid token." });
            var user = await _userService.GetUserByIdAsync(userId); 
            return Ok(user); 
        }

    }
}
