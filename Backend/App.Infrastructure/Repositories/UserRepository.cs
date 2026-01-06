using App.Domain.Entities;
using App.Domain.Enums;
using App.Domain.Interfaces;
using App.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace App.Infrastructure.Repositories
{
    public class UserRepository(AppDbContext context) : IUserRepository
    {
        public readonly AppDbContext _context = context;

        public async Task<User> CreateAsync(User User)
        {
            _context.Users.Add(User);
            await _context.SaveChangesAsync();
            return User;
        }

        public async Task<User?> GetByUserIdAsync(Guid userId)
        {
            var user = await _context.Users.FindAsync(userId);
            return user!;
        }

        public async Task<IEnumerable<User>> GetAllAsync(Guid orgId)
        {
            return await _context.Users.Where(u => u.OrgId == orgId)
                .ToListAsync();
        }
        
        public async Task<IEnumerable<User>> GetAllAdminAsync(Guid orgId)
        {
            return await _context.Users.Where(u => u.OrgId == orgId && u.UserRole == UserRoles.OrgAdmin)
                .ToListAsync();
        }
        public async Task<bool> DeleteAsync(Guid userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<User?> GetByEmailUsernameAsync(string EmailUsername)
        {
            return await _context.Users.FirstOrDefaultAsync(f => f.Email == EmailUsername || f.UserName == EmailUsername);
        }

        public async Task UpdateAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
    }
}
