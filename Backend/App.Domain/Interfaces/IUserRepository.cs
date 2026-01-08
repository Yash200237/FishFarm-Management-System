using App.Domain.Entities;

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
