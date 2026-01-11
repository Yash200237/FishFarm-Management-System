using App.Domain.Entities;
using App.Domain.Interfaces;
using App.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace App.Infrastructure.Repositories
{
    public class WorkerRepository(AppDbContext context) : IWorkerRepository
    {
        public readonly AppDbContext _context = context;
        public async Task<Worker> CreateAsync(Worker worker)
        {
            _context.Workers.Add(worker);
            await _context.SaveChangesAsync();
            return worker;
        }

        public async Task<bool> DeleteAsync(Guid workerId, Guid orgId)
        {
            var worker = await _context.Workers.FirstOrDefaultAsync(f => f.WorkerId == workerId && f.OrgId == orgId);
            if (worker == null) return false;
            _context.Workers.Remove(worker);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Worker>> GetAllAsync(Guid orgId)
        {
            return await _context.Workers.Where(w=>w.OrgId == orgId)
                .ToListAsync();
        }

        public async Task<Worker> GetByIdAsync(Guid workerId, Guid orgId)
        {
            var worker = await _context.Workers.FirstOrDefaultAsync(f => f.WorkerId == workerId && f.OrgId == orgId);
            return worker!;
        }

        public async Task UpdateAsync(Worker worker)
        {
            _context.Workers.Update(worker);
            await _context.SaveChangesAsync();
        }
    }
}
