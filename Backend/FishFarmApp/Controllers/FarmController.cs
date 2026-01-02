using App.Application.Interfaces;
using App.Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FishFarmApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FarmController(IFarmService farmService, ILogger<FarmController> logger) : ControllerBase
    {
        private readonly IFarmService _farmService = farmService;
        private readonly ILogger<FarmController> _logger = logger;

        [Authorize(Policy = "RequireOrgAdmin")]
        [HttpPost]
        public async Task<ActionResult<FarmResponseDto>> CreateFarm([FromBody] CreateFarmDto createFarmDto)
        {
            try
            {
                var orgClaimValue = User.FindFirst("OrgId")?.Value;
                if (string.IsNullOrWhiteSpace(orgClaimValue))
                    return Forbid();

                if (!Guid.TryParse(orgClaimValue, out var orgId))
                    return Forbid();

                var createdFarm = await _farmService.CreateFarmAsync(orgId, createFarmDto);
                return CreatedAtAction(nameof(GetFarmById), new { id = createdFarm.FarmId }, createdFarm);
            }
            catch (ArgumentException ex)
            {
                _logger.LogError(ex, "Validation error while creating farm.");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating farm.");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "RequireOrgMember")]

        public async Task<ActionResult<FarmResponseDto>> GetFarmById(Guid id)
        {
            try
            {
                var farm = await _farmService.GetFarmByIdAsync(id);
                return Ok(farm);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogError(ex, $"Farm with ID {id} not found.");
                return NotFound(new { message = ex.Message });
            }
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
            try
            {
                var updatedFarm = await _farmService.UpdateFarmAsync(id, updateFarmDto);
                return Ok(updatedFarm);
            }
            catch (ArgumentException ex)
            {
                _logger.LogError(ex, "Validation error while updating farm.");
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogError(ex, $"Farm with ID {id} not found.");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating farm.");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [Authorize(Policy = "RequireOrgAdmin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteFarm(Guid id)
        {
            try
            {
                await _farmService.DeleteFarmAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogError(ex, $"Farm with ID {id} not found.");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting farm.");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}
