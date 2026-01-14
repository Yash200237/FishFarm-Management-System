using App.Application.DTOs;
using App.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FishFarmApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IUserService userService, IAuthService authService ) : ControllerBase
    {
        private readonly IUserService _userService = userService;
        private readonly IAuthService _authService = authService;

        [Authorize]
        [HttpGet("me")]

        public async Task<ActionResult<UserResponseDto>> GetCurrentUser() {

            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            if (string.IsNullOrWhiteSpace(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
                return Unauthorized(new { message = "Invalid token." });
            var user = await _userService.GetUserByIdAsync(userId); 
            return Ok(user); 
        }


        [HttpPost("Login")]
        public async Task<ActionResult<LoginResponseDto>> LoginUserIn([FromBody] LoginDto loginUserDto)
        {
            var result = await _authService.GetUserByEmailUsernameAsync(loginUserDto);
            if (!string.IsNullOrEmpty(result.RefreshToken))
            {
                Response.Cookies.Append("refreshToken", result.RefreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = result.RefreshTokenExpiry,
                    Path = "/api"
                });
            }
            return Ok(result.Dto);
        }

        [HttpPost("RefreshToken")]
        public async Task<ActionResult<LoginResponseDto>> RefreshToken()
        {
            if (!Request.Cookies.TryGetValue("refreshToken",out var refreshToken))
            {
                return Unauthorized("Missing refresh token.");

            };
            var result = await _authService.RefreshToken(refreshToken);

            if (!string.IsNullOrEmpty(result.RefreshToken))
            {
                Response.Cookies.Append("refreshToken", result.RefreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = result.RefreshTokenExpiry,
                    Path = "/api"
                });
            }
            return Ok(result.Dto);

        }

        [HttpPost("Logout")]
        public async Task<ActionResult> Logout()
        {
            if (Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
                await _authService.RemoveRefreshTokenAsync(refreshToken);

            Response.Cookies.Delete("refreshToken", new CookieOptions
            {
                Path = "/api",
                Secure = true,
                SameSite = SameSiteMode.None,
                HttpOnly = true
            });

            return Ok();
        }



    }
}
