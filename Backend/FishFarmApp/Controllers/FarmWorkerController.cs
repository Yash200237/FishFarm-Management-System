 using App.Application.Interfaces;
using App.Application.Services;
using App.Application.DTOs;
using App.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Security.Cryptography;

namespace FishFarmApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FarmWorkerController(IFarmWorkerService farmWorkerService, ILogger<FarmWorkerController> logger) : ControllerBase
    {
        private readonly IFarmWorkerService _farmWorkerService = farmWorkerService;
        private readonly ILogger<FarmWorkerController> _logger = logger;

        [Authorize(Policy = "RequireOrgMember")]
        [HttpGet("farm/{FarmId}/workers")]
        public async Task<ActionResult<IEnumerable<FarmWorkerDetailsDto>>> GetWorkersByFarmId(Guid FarmId)
        {
            try
            {
                var workers = await _farmWorkerService.GetWorkers(FarmId);
                return Ok(workers);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogError(ex, $"Workers with FarmId {FarmId} not found.");
                return NotFound(new { message = ex.Message });
            }
        }

        [Authorize(Policy = "RequireOrgMember")]
        [HttpGet("worker/{WorkerId}/farms")]
        public async Task<ActionResult<IEnumerable<FarmWDetailsDto>>> GetFarmsByWorkerId(Guid WorkerId)
        {
            try
            {
                var farms = await _farmWorkerService.GetFarms(WorkerId);
                return Ok(farms);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogError(ex, $"Farms with WorkerId {WorkerId} not found.");
                return NotFound(new { message = ex.Message });
            }
        }

        [Authorize(Policy = "RequireOrgMember")]
        [HttpGet("worker/unassigned")]
        public async Task<ActionResult<IEnumerable<WorkerResponseDto>>> GetUnassignedWorkers()
        {
            try
            {
                var orgClaimValue = User.FindFirst("OrgId")?.Value;
                if (string.IsNullOrWhiteSpace(orgClaimValue))
                    return Forbid();

                if (!Guid.TryParse(orgClaimValue, out var orgId))
                    return Forbid();

                var unasignedWorkers = await _farmWorkerService.GetUnassignedWorkers(orgId);
                return Ok(unasignedWorkers);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogError(ex, $"Unassigned workers not found.");
                return NotFound(new { message = ex.Message });
            }
        }

        [Authorize(Policy = "RequireOrgMember")]
        [HttpPost]
        public async Task<ActionResult> AssignWorkerToFarm(WorkerToFarmDto workerToFarmDto)
        {
            try
            {
                await _farmWorkerService.AssignWorker(workerToFarmDto);
                return Ok();
            }
            catch (ArgumentException ex)
            {
                _logger.LogError(ex, "Validation error while assigning worker.");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred assigning worker.");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [Authorize(Policy = "RequireOrgMember")]
        [HttpPatch]
        public async Task<ActionResult> ModifyWorkerToFarm(WorkerToFarmDto workerToFarmDto)
        {
            try
            {
                await _farmWorkerService.ModifyAssignment(workerToFarmDto);
                return Ok();
            }
            catch (ArgumentException ex)
            {
                _logger.LogError(ex, "Validation error while modifying worker assignment.");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred modifying worker assignment.");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [Authorize(Policy = "RequireOrgMember")]
        [HttpDelete("{FarmId:guid}/{WorkerId:guid}")]
        public async Task<ActionResult> RemoveWorkerFromFarm(Guid WorkerId, Guid FarmId)
        {
            try
            {
                await _farmWorkerService.RemoveWorker(WorkerId, FarmId);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogError(ex, $"Worker or Farm not found.");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while removing worker from farm.");
                return StatusCode(500, new { message = "Internal server error" });
            }

        }
    }
}