using App.Domain.Entities;
using App.Domain.Interfaces;
using App.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace App.Infrastructure.Repositories
{
    public class OrgRepository(AppDbContext context) : IOrgRepository
    {
        public readonly AppDbContext _context = context;

        public async Task<Org> CreateAsync(Org org)
        {
            _context.Organizations.Add(org);
            await _context.SaveChangesAsync();
            return org;
        }

        public async Task<bool> DeleteAsync(Guid OrgId)
        {
            var org = await _context.Organizations.FindAsync(OrgId);
            if (org == null) return false;
            _context.Organizations.Remove(org);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Org>> GetAllAsync()
        {
            return await _context.Organizations
                .ToListAsync();
        }

        public async Task<Org?> GetByIdAsync(Guid orgId)
        {
            return await _context.Organizations.FirstOrDefaultAsync(f => f.OrgId == orgId);

        }

        public async Task UpdateAsync(Org org)
        {
            _context.Organizations.Update(org);
            await _context.SaveChangesAsync();
        }
    }
}
