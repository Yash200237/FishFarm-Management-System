using App.Application.DTOs;
using App.Application.Interfaces;
using App.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FishFarmApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FarmWorkerController(IFarmWorkerService farmWorkerService) : ControllerBase
    {
        private readonly IFarmWorkerService _farmWorkerService = farmWorkerService;

        [Authorize(Policy = "RequireOrgMember")]
        [HttpGet("farm/{FarmId}/workers")]
        public async Task<ActionResult<IEnumerable<FarmWorkerDetailsDto>>> GetWorkersByFarmId(Guid FarmId)
        {
                var workers = await _farmWorkerService.GetWorkers(FarmId);
                return Ok(workers);
 
        }

        [Authorize(Policy = "RequireOrgMember")]
        [HttpGet("worker/{WorkerId}/farms")]
        public async Task<ActionResult<IEnumerable<FarmWDetailsDto>>> GetFarmsByWorkerId(Guid WorkerId)
        {
                var farms = await _farmWorkerService.GetFarms(WorkerId);
                return Ok(farms);

        }

        [Authorize(Policy = "RequireOrgMember")]
        [HttpGet("worker/unassigned")]
        public async Task<ActionResult<IEnumerable<WorkerResponseDto>>> GetUnassignedWorkers()
        {

                var orgClaimValue = User.FindFirst("OrgId")?.Value;
                if (string.IsNullOrWhiteSpace(orgClaimValue))
                    return Forbid();

                if (!Guid.TryParse(orgClaimValue, out var orgId))
                    return Forbid();

                var unasignedWorkers = await _farmWorkerService.GetUnassignedWorkers(orgId);
                return Ok(unasignedWorkers);

        }

        [Authorize(Policy = "RequireOrgMember")]
        [HttpGet("worker/unassigned/{farmId}")]
        public async Task<ActionResult<IEnumerable<WorkerResponseDto>>> GetUnassignedWorkersToFarm(Guid farmId)
        {
                var orgClaimValue = User.FindFirst("OrgId")?.Value;
                if (string.IsNullOrWhiteSpace(orgClaimValue))
                    return Forbid();

                if (!Guid.TryParse(orgClaimValue, out var orgId))
                    return Forbid();

                var unasignedWorkersToFarm = await _farmWorkerService.GetFarmWorkersUnassigned(orgId,farmId);
                return Ok(unasignedWorkersToFarm);
        }


        [Authorize(Policy = "RequireOrgMember")]
        [HttpGet("{FarmId}/{WorkerId}")]
        public async Task<ActionResult<WorkerToFarmDto>> GetFarmWorkerByIds(Guid WorkerId, Guid FarmId)
        {

                var farmworker = await _farmWorkerService.GetFarmWorkerByIdAsync(WorkerId, FarmId);
                return Ok(farmworker);
 
        }

        [Authorize(Policy = "RequireOrgMember")]
        [HttpPost]
        public async Task<ActionResult> AssignWorkerToFarm(WorkerToFarmDto workerToFarmDto)
        {
            var orgClaimValue = User.FindFirst("OrgId")?.Value;
            if (string.IsNullOrWhiteSpace(orgClaimValue))
                return Forbid();

            if (!Guid.TryParse(orgClaimValue, out var orgId))
                return Forbid();
            await _farmWorkerService.AssignWorker(workerToFarmDto, orgId);
                return Ok();

        }

        [Authorize(Policy = "RequireOrgMember")]
        [HttpPatch]
        public async Task<ActionResult> ModifyWorkerToFarm(WorkerToFarmDto workerToFarmDto)
        {

                await _farmWorkerService.ModifyAssignment(workerToFarmDto);
                return Ok();

        }

        [Authorize(Policy = "RequireOrgMember")]
        [HttpDelete("{FarmId:guid}/{WorkerId:guid}")]
        public async Task<ActionResult> RemoveWorkerFromFarm(Guid WorkerId, Guid FarmId)
        {
 
                await _farmWorkerService.RemoveWorker(WorkerId, FarmId);
                return NoContent();

        }
    }
}