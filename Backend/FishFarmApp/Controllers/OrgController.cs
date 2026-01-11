using App.Application.DTOs;
using App.Application.Interfaces;
using App.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FishFarmApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrgController(IOrgService orgService) : ControllerBase
    {
        private readonly IOrgService _orgService = orgService;

        [Authorize(Policy = "RequireGlobalAdmin")]
        [HttpPost]
        public async Task<ActionResult<OrgResponseDto>> CreateOrg([FromBody] OrgDto createOrgDto)
        {
                var createdOrg = await _orgService.CreateOrgAsync(createOrgDto);
                return CreatedAtAction(nameof(GetOrgById), new { id = createdOrg.OrgId }, createdOrg);

        }

        [Authorize(Policy = "RequireAnyUser")]
        [HttpGet("{id}")]
        public async Task<ActionResult<OrgResponseDto>> GetOrgById(Guid id)
        {
            if (!User.IsInRole(UserRoles.GlobalAdmin.ToString()))
            {
                var orgClaimValue = User.FindFirst("OrgId")?.Value;

                if (string.IsNullOrWhiteSpace(orgClaimValue) || !Guid.TryParse(orgClaimValue, out var orgId))
                    return Forbid();

                if (orgId != id)
                    return Forbid();
            }

            var org = await _orgService.GetOrgByIdAsync(id);
            return Ok(org);
        }


        [Authorize(Policy = "RequireGlobalAdmin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrgResponseDto>>> GetAllOrgs()
        {
            var orgs = await _orgService.GetAllOrgsAsync();
            return Ok(orgs);
        }

        [Authorize(Policy = "RequireGlobalAdmin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<OrgResponseDto>> UpdateOrg(Guid id, [FromBody] OrgDto updateOrgDto)
        {

                var updatedOrg = await _orgService.UpdateOrgAsync(id, updateOrgDto);
                return Ok(updatedOrg);

        }

        [Authorize(Policy = "RequireGlobalAdmin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteOrg(Guid id)
        {

                await _orgService.DeleteOrgAsync(id);
                return NoContent();
 
        }


    }
}
