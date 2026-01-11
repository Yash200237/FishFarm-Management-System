using App.Application.Interfaces;
using App.Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FishFarmApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkerController(IWorkerService workerService) : ControllerBase
    {
        private readonly IWorkerService _workerService = workerService;

        [Authorize(Policy = "RequireOrgMember")]
        [HttpPost]
        public async Task<ActionResult<WorkerResponseDto>> CreateWorker([FromBody] CreateWorkerDto createWorkerDto)
        {

                var orgClaimValue = User.FindFirst("OrgId")?.Value;
                if (string.IsNullOrWhiteSpace(orgClaimValue))
                    return Forbid();

                if (!Guid.TryParse(orgClaimValue, out var orgId))
                    return Forbid();
                var createdWorker = await _workerService.CreateWorkerAsync(orgId,createWorkerDto);
                return CreatedAtAction(nameof(GetWorkerById), new { id = createdWorker.WorkerId }, createdWorker);
        }


        [Authorize(Policy = "RequireOrgMember")]
        [HttpGet("{id}")]

        public async Task<ActionResult<WorkerResponseDto>> GetWorkerById(Guid id)
        {
            var orgClaimValue = User.FindFirst("OrgId")?.Value;
            if (string.IsNullOrWhiteSpace(orgClaimValue))
                return Forbid();

            if (!Guid.TryParse(orgClaimValue, out var orgId))
                return Forbid();

            var worker = await _workerService.GetWorkerByIdAsync(id, orgId);
                return Ok(worker);
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
            var orgClaimValue = User.FindFirst("OrgId")?.Value;
            if (string.IsNullOrWhiteSpace(orgClaimValue))
                return Forbid();

            if (!Guid.TryParse(orgClaimValue, out var orgId))
                return Forbid();
            var updatedWorker = await _workerService.UpdateWorkerAsync(id, updateWorkerDto, orgId);
                return Ok(updatedWorker);

        }


        [Authorize(Policy = "RequireOrgMember")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteWorker(Guid id)
        {
            var orgClaimValue = User.FindFirst("OrgId")?.Value;
            if (string.IsNullOrWhiteSpace(orgClaimValue))
                return Forbid();

            if (!Guid.TryParse(orgClaimValue, out var orgId))
                return Forbid();
            await _workerService.DeleteWorkerAsync(id, orgId);
                return NoContent();

        }

    }
}
