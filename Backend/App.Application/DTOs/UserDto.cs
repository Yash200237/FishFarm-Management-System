using App.Domain.Entities;
using App.Domain.Enums;

namespace App.Application.DTOs
{
    public class UserDto
    {

        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public UserRoles UserRole { get; set; }

    }
}
