using App.Domain.Entities;
using App.Domain.Interfaces;
using App.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace App.Infrastructure.Repositories
{
    public class FarmRepository(AppDbContext context) : IFarmRepository
    {
        public readonly AppDbContext _context = context;

        public async Task<Farm> CreateAsync(Farm farm)
        {
            _context.Farms.Add(farm);
            await _context.SaveChangesAsync();
            return farm;
        }

        public async Task<bool> DeleteAsync(Guid farmId)
        {
            var farm = await _context.Farms.FindAsync(farmId);
            if (farm == null) return false;
            _context.Farms.Remove(farm);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Farm>> GetAllAsync(Guid orgId)
        {
            return await _context.Farms
                .Where(f => f.OrgId == orgId)
                .ToListAsync();
        }

        public async Task<Farm?> GetByIdAsync(Guid farmId)
        {
            return await _context.Farms.FirstOrDefaultAsync(f => f.FarmId == farmId);
             
        }

        public async Task UpdateAsync(Farm farm)
        {
            _context.Farms.Update(farm);
            await _context.SaveChangesAsync();
        }
    }
}
