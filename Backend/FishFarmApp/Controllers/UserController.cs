using App.Application.Interfaces;
using App.Application.DTOs;
using App.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FishFarmApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(IUserService userService, ILogger<UserController> logger) : ControllerBase
    {
        private readonly IUserService _userService = userService;
        private readonly ILogger<UserController> _logger = logger;

        [Authorize(Policy = "RequireOrgAdmin")]
        [HttpPost("RegisterOrgUser")]
        public async Task<ActionResult<UserResponseDto>> CreateOrgUser([FromBody] RegisterUserDto registerUserDto)
        {
            try
            {
                // Org Admin can only create users within their organization
                var orgId = User.FindFirst("OrgId")?.Value;
                if (string.IsNullOrEmpty(orgId))
                {
                    return Forbid("Only organisation members can create users.");
                }

                registerUserDto.OrgId = Guid.Parse(orgId);
                registerUserDto.UserRole = UserRoles.OrgUser;
                var createdUser = await _userService.CreateUserAsync(registerUserDto);
                return CreatedAtAction(nameof(GetUserById), new { id = createdUser.UserId }, createdUser);
            }
            catch (ArgumentException ex)
            {
                _logger.LogError(ex, "Validation error while creating user.");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating User.");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [Authorize(Policy = "RequireGlobalAdmin")]
        [HttpPost("RegisterOrgAdmin")]

        public async Task<ActionResult<UserResponseDto>> CreateOrgAdmin([FromBody] RegisterUserDto registerUserDto)
        {
            try
            {
                // Global Admin must provide an OrgId when creating an Org Admin
                if (!registerUserDto.OrgId.HasValue)
                {
                    return BadRequest("OrgId is required for creating an Org Admin.");
                }
                registerUserDto.UserRole = UserRoles.OrgAdmin;
                var createdUser = await _userService.CreateUserAsync(registerUserDto);
                return CreatedAtAction(nameof(GetUserById), new { id = createdUser.UserId }, createdUser);
            }
            catch (ArgumentException ex)
            {
                _logger.LogError(ex, "Validation error while creating user.");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating User.");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("Login")]                                                    
        public async Task<ActionResult<LoginResponseDto>> LoginUserIn([FromBody] LoginDto loginUserDto)
        {
            try
            {
                var loggedInUser = await _userService.GetUserByEmailUsernameAsync(loginUserDto);
                return Ok(loggedInUser);
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Login failed.");
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while logging in.");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<UserResponseDto>> GetUserById(Guid id) {
            try { 
                var user = await _userService.GetUserByIdAsync(id); 
                return Ok(user); 
            } 
            catch (KeyNotFoundException ex){ 
                _logger.LogError(ex, $"User with ID {id} not found."); 
                return NotFound(new { message = ex.Message }); 
            } 
        }

        [Authorize(Policy = "RequireOrgAdmin")]
        [HttpGet]

        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAllUsersByOrgId()
        {
            var orgClaimValue = User.FindFirst("OrgId")?.Value;
            if (string.IsNullOrWhiteSpace(orgClaimValue))
                return Forbid();

            if (!Guid.TryParse(orgClaimValue, out var orgId))
                return Forbid();
            var users = await _userService.GetAllUsersAsync(orgId);
            return Ok(users);
        }

        [Authorize(Policy = "RequireOrgMember")]
        [HttpPut("{id}")]
        public async Task<ActionResult<UserResponseDto>> UpdateUser(Guid id,[FromBody] UserDto updateUserDto)
        {
            try
            {
                var updatedUser = await _userService.UpdateUserAsync(id, updateUserDto);
                return Ok(updatedUser);
            }
            catch (ArgumentException ex)
            {
                _logger.LogError(ex, "Validation error while updating user.");
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogError(ex, $"User with ID {id} not found.");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating user.");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [Authorize(Policy = "RequireOrgMember")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(Guid id)
        {
            try
            {
                await _userService.DeleteUserAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogError(ex, $"User with ID {id} not found.");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting user.");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }



    }
}
