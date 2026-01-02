using App.Domain.Entities;

namespace App.Domain.Interfaces
{
    public interface IFarmWorkerRepository
    {
        Task<FarmWorker> CreateAsync(FarmWorker farmWorker);
        Task<bool> DeleteAsync(Guid workerId, Guid farmId);
        Task<FarmWorker?> GetByIdAsync(Guid farmId, Guid workerId);
        Task UpdateAsync(FarmWorker farmWorker);
        Task<IEnumerable<FarmWorker>> GetFarmsForWorkerId(Guid workerId);
        Task<IEnumerable<FarmWorker>> GetWorkersForFarmId(Guid farmId);
        Task<IEnumerable<Worker>> GetWorkersUnassigned(Guid orgId);

    }
}
                                       