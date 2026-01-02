using App.Domain.Entities;

namespace App.Domain.Interfaces
{
    public interface IFarmRepository
    {
        Task<Farm?> GetByIdAsync(Guid farmId);
        Task<IEnumerable<Farm>> GetAllAsync(Guid orgId);
        Task<Farm> CreateAsync(Farm farm);
        Task UpdateAsync(Farm farm);
        Task<bool> DeleteAsync(Guid farmId);
    }
}
