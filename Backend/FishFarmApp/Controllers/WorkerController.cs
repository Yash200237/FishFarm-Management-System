using App.Application.Interfaces;
using App.Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FishFarmApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkerController(IWorkerService workerService, ILogger< WorkerController> logger) : ControllerBase
    {
        private readonly IWorkerService _workerService = workerService;
        private readonly ILogger<WorkerController> _logger = logger;

        [Authorize(Policy = "RequireOrgMember")]
        [HttpPost]
        public async Task<ActionResult<WorkerResponseDto>> CreateWorker([FromBody] CreateWorkerDto createWorkerDto)
        {
            try
            {
                var orgClaimValue = User.FindFirst("OrgId")?.Value;
                if (string.IsNullOrWhiteSpace(orgClaimValue))
                    return Forbid();

                if (!Guid.TryParse(orgClaimValue, out var orgId))
                    return Forbid();
                var createdWorker = await _workerService.CreateWorkerAsync(orgId,createWorkerDto);
                return CreatedAtAction(nameof(GetWorkerById), new { id = createdWorker.WorkerId }, createdWorker);
            }
            catch (ArgumentException ex)
            {
                _logger.LogError(ex, "Validation error while creating worker.");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating worker.");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }



        [Authorize(Policy = "RequireOrgMember")]
        [HttpGet("{id}")]

        public async Task<ActionResult<WorkerResponseDto>> GetWorkerById(Guid id)
        {
            try
            {
                var worker = await _workerService.GetWorkerByIdAsync(id);
                return Ok(worker);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogError(ex, $"Worker with ID {id} not found.");
                return NotFound(new { message = ex.Message });
            }
        }

        [Authorize(Policy = "RequireOrgMember")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorkerResponseDto>>> GetAllWorkers()
        {
            var orgClaimValue = User.FindFirst("OrgId")?.Value;
            if (string.IsNullOrWhiteSpace(orgClaimValue))
                return Forbid();

            if (!Guid.TryParse(orgClaimValue, out var orgId))
                return Forbid();
            var workers = await _workerService.GetAllWorkersAsync(orgId);
            return Ok(workers);
        }

        [Authorize(Policy = "RequireOrgMember")]
        [HttpPut("{id}")]
        public async Task<ActionResult<WorkerResponseDto>> UpdateWorker(Guid id, [FromBody] UpdateWorkerDto updateWorkerDto)
        {
            try
            {
                var updatedWorker = await _workerService.UpdateWorkerAsync(id, updateWorkerDto);
                return Ok(updatedWorker);
            }
            catch (ArgumentException ex)
            {
                _logger.LogError(ex, "Validation error while updating Worker.");
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogError(ex, $"Worker with ID {id} not found.");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating worker.");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [Authorize(Policy = "RequireOrgMember")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteWorker(Guid id)
        {
            try
            {
                await _workerService.DeleteWorkerAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogError(ex, $"Worker with ID {id} not found.");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting worker.");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }



    }
}
