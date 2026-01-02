using App.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Domain.Interfaces
{
    public interface IOrgRepository
    {
        Task<Org> CreateAsync(Org org);
        Task<bool> DeleteAsync(Guid OrgId);
        Task<IEnumerable<Org>> GetAllAsync();
        Task<Org?> GetByIdAsync(Guid orgId);
        Task UpdateAsync(Org org);

    }
}
