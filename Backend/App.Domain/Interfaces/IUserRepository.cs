using App.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Domain.Interfaces
{
    public interface IUserRepository
    {
        Task<User> CreateAsync(User user);
        Task<bool> DeleteAsync(Guid userId);
        Task<User> GetByUserIdAsync(Guid userId);
        Task<IEnumerable<User>> GetAllAsync(Guid orgId);
        Task<IEnumerable<User>> GetAllAdminAsync(Guid orgId);
        Task<User?> GetByEmailUsernameAsync(string EmailUsername);
        Task UpdateAsync(User user);
    }
}
