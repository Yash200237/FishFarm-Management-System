using App.Domain.Entities;
using App.Domain.Interfaces;
using App.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace App.Infrastructure.Repositories
{
    public class FarmWorkerRepository(AppDbContext context) : IFarmWorkerRepository
    {
        public readonly AppDbContext _context = context;

        public async Task<FarmWorker> CreateAsync(FarmWorker farmWorker)
        {
            _context.FarmWorkers.Add(farmWorker);
            await _context.SaveChangesAsync();
            return farmWorker;
        }

        public async Task<bool> DeleteAsync(Guid workerId, Guid farmId)
        {
            var farmWorker = await _context.FarmWorkers.FindAsync( farmId, workerId);
            if (farmWorker == null) return false;
            _context.FarmWorkers.Remove(farmWorker);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<FarmWorker>> GetFarmsForWorkerId(Guid workerId)
        {
            return await _context.FarmWorkers
                    .Where(fw => fw.WorkerId == workerId)
                    .Include(fw => fw.Farm)
                    .ToListAsync();
        }
        public async Task<IEnumerable<FarmWorker>> GetWorkersForFarmId(Guid farmId)
        {
            return await _context.FarmWorkers
                    .Where(fw => fw.FarmId == farmId)
                    .Include(fw => fw.Worker)
                    .ToListAsync();
        }

        public async Task<IEnumerable<Worker>> GetWorkersUnassigned(Guid orgId)
        {
            return await _context.Workers
                    .Where(w => w.OrgId == orgId)
                    .Where(w => !w.FarmWorkers.Any())
                    .ToListAsync();
        }

        public async Task<FarmWorker?> GetByIdAsync(Guid farmId, Guid workerId)
        {
            return await _context.FarmWorkers.FirstOrDefaultAsync(fw => fw.FarmId == farmId && fw.WorkerId == workerId);
        }

        public async Task UpdateAsync(FarmWorker farmWorker)
        {
            _context.FarmWorkers.Update(farmWorker);
            await _context.SaveChangesAsync();
        }
    }
}
