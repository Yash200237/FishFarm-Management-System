using App.Application.Interfaces;
using App.Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FishFarmApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrgController(IOrgService orgService, ILogger<OrgController> logger) : ControllerBase
    {
        private readonly IOrgService _orgService = orgService;
        private readonly ILogger<OrgController> _logger = logger;

        [Authorize(Policy = "RequireGlobalAdmin")]
        [HttpPost]
        public async Task<ActionResult<OrgResponseDto>> CreateOrg([FromBody] OrgDto createOrgDto)
        {
            try
            {
                var createdOrg = await _orgService.CreateOrgAsync(createOrgDto);
                return CreatedAtAction(nameof(GetOrgById), new { id = createdOrg.OrgId }, createdOrg);
            }
            catch (ArgumentException ex)
            {
                _logger.LogError(ex, "Validation error while creating organization.");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating organization.");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("{id}")]

        public async Task<ActionResult<OrgResponseDto>> GetOrgById(Guid id)
        {
            try
            {
                var org = await _orgService.GetOrgByIdAsync(id);
                return Ok(org);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogError(ex, $"Organization with ID {id} not found.");
                return NotFound(new { message = ex.Message });
            }
        }

        [Authorize(Policy = "RequireGlobalAdmin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrgResponseDto>>> GetAllOrgs()
        {
            var orgs = await _orgService.GetAllOrgsAsync();
            return Ok(orgs);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<OrgResponseDto>> UpdateOrg(Guid id, [FromBody] OrgDto updateOrgDto)
        {
            try
            {
                var updatedOrg = await _orgService.UpdateOrgAsync(id, updateOrgDto);
                return Ok(updatedOrg);
            }
            catch (ArgumentException ex)
            {
                _logger.LogError(ex, "Validation error while updating organization.");
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogError(ex, $"Organization with ID {id} not found.");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating organization.");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [Authorize(Policy = "RequireGlobalAdmin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteOrg(Guid id)
        {
            try
            {
                await _orgService.DeleteOrgAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogError(ex, $"Organization with ID {id} not found.");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting organization.");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }



    }
}
