using App.Application.Interfaces;
using App.Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FishFarmApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FarmController(IFarmService farmService) : ControllerBase
    {
        private readonly IFarmService _farmService = farmService;

        [Authorize(Policy = "RequireOrgAdmin")]
        [HttpPost]
        public async Task<ActionResult<FarmResponseDto>> CreateFarm([FromBody] CreateFarmDto createFarmDto)
        {
            var orgClaimValue = User.FindFirst("OrgId")?.Value;
            if (string.IsNullOrWhiteSpace(orgClaimValue))
                return Forbid();

            if (!Guid.TryParse(orgClaimValue, out var orgId))
                return Forbid();

            var createdFarm = await _farmService.CreateFarmAsync(orgId, createFarmDto);
            return CreatedAtAction(nameof(GetFarmById), new { id = createdFarm.FarmId }, createdFarm);
        }


        [HttpGet("{id}")]
        [Authorize(Policy = "RequireOrgMember")]
        public async Task<ActionResult<FarmResponseDto>> GetFarmById(Guid id)
        {
            var orgClaimValue = User.FindFirst("OrgId")?.Value;
            if (string.IsNullOrWhiteSpace(orgClaimValue))
                return Forbid();

            if (!Guid.TryParse(orgClaimValue, out var orgId))
                return Forbid();

            var farm = await _farmService.GetFarmByIdAsync(id, orgId);
            return Ok(farm);

        }


        [Authorize(Policy = "RequireOrgMember")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FarmResponseDto>>> GetAllFarmsOfOrg()
        {
            var orgClaimValue = User.FindFirst("OrgId")?.Value;
            if (string.IsNullOrWhiteSpace(orgClaimValue))
                return Forbid();

            if (!Guid.TryParse(orgClaimValue, out var orgId))
                return Forbid();
            var farms = await _farmService.GetAllFarmsAsync(orgId);
            return Ok(farms);
        }


        [Authorize(Policy = "RequireOrgAdmin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<FarmResponseDto>> UpdateFarm(Guid id,[FromBody] UpdateFarmDto updateFarmDto)
        {
            var orgClaimValue = User.FindFirst("OrgId")?.Value;
            if (string.IsNullOrWhiteSpace(orgClaimValue))
                return Forbid();

            if (!Guid.TryParse(orgClaimValue, out var orgId))
                return Forbid();
            var updatedFarm = await _farmService.UpdateFarmAsync(id, updateFarmDto,orgId);
            return Ok(updatedFarm);

        }


        [Authorize(Policy = "RequireOrgAdmin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteFarm(Guid id)
        {
            var orgClaimValue = User.FindFirst("OrgId")?.Value;
            if (string.IsNullOrWhiteSpace(orgClaimValue))
                return Forbid();

            if (!Guid.TryParse(orgClaimValue, out var orgId))
                return Forbid();

            await _farmService.DeleteFarmAsync(id,orgId);
            return NoContent();

        }
    }
}
