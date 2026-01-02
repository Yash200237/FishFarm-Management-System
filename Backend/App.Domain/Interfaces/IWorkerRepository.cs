using App.Domain.Entities;

namespace App.Domain.Interfaces
{
    public interface IWorkerRepository
    {
        Task<Worker> GetByIdAsync(Guid workerId);
        Task<IEnumerable<Worker>> GetAllAsync(Guid orgId);
        Task<Worker> CreateAsync(Worker worker);
        Task UpdateAsync(Worker worker);
        Task<bool> DeleteAsync(Guid workerId);
    }
}
