using App.Application.DTOs;

namespace App.Application.Interfaces
{
    public interface IWorkerService
    {
        Task<WorkerResponseDto> CreateWorkerAsync(Guid orgId, CreateWorkerDto createworkerDto);
        Task<WorkerResponseDto> GetWorkerByIdAsync(Guid Id);
        Task<IEnumerable<WorkerResponseDto>> GetAllWorkersAsync(Guid orgId);
        Task<WorkerResponseDto> UpdateWorkerAsync(Guid id, UpdateWorkerDto updateWorkerDto);
        Task DeleteWorkerAsync(Guid id);
    }
}
