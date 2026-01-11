using App.Application.Interfaces;
using App.Application.DTOs;
using App.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FishFarmApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(IUserService userService) : ControllerBase
    {
        private readonly IUserService _userService = userService;

        [Authorize(Policy = "RequireOrgAdmin")]
        [HttpPost("RegisterOrgUser")]
        public async Task<ActionResult<UserResponseDto>> CreateOrgUser([FromBody] RegisterUserDto registerUserDto)
        {

                // Org Admin can only create users within their organization
                var orgIdStr = User.FindFirst("OrgId")?.Value;
                if (string.IsNullOrWhiteSpace(orgIdStr) || !Guid.TryParse(orgIdStr, out var orgId))
                    return Forbid();

                registerUserDto.OrgId = orgId;
                registerUserDto.UserRole = UserRoles.OrgUser;
                var createdUser = await _userService.CreateUserAsync(registerUserDto);
                return CreatedAtAction(nameof(GetUserById), new { id = createdUser.UserId }, createdUser);

        }


        [Authorize(Policy = "RequireGlobalAdmin")]
        [HttpPost("RegisterOrgAdmin")]

        public async Task<ActionResult<UserResponseDto>> CreateOrgAdmin([FromBody] RegisterUserDto registerUserDto)
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


        [HttpPost("Login")]
        public async Task<ActionResult<LoginResponseDto>> LoginUserIn([FromBody] LoginDto loginUserDto)
        {

            var loggedInUser = await _userService.GetUserByEmailUsernameAsync(loginUserDto);
            return Ok(loggedInUser);

        }


        [Authorize(Policy = "RequireGlobalAdminOrOrgAdmin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponseDto>> GetUserById(Guid id)
        {

                var user = await _userService.GetUserByIdAsync(id);
                return Ok(user);

        }


        [Authorize(Policy = "RequireOrgAdmin")]
        [HttpGet("{orgId}/users")]

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


        [Authorize(Policy = "RequireGlobalAdmin")]
        [HttpGet("{orgId}/adminusers")]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAllAdminUsersByOrgId(Guid orgId)
        {

                var users = await _userService.GetAdminUsersAsync(orgId);
                return Ok(users);

        }


        [Authorize(Policy = "RequireGlobalAdminOrOrgAdmin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<UserResponseDto>> UpdateUser(Guid id,[FromBody] EditUserDto updateUserDto)
        {

                var updatedUser = await _userService.UpdateUserAsync(id, updateUserDto);
                return Ok(updatedUser);

        }


        [Authorize(Policy = "RequireGlobalAdminOrOrgAdmin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(Guid id)
        {

                await _userService.DeleteUserAsync(id);
                return NoContent();

        }

    }
}
