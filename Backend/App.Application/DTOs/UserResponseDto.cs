using App.Domain.Entities;
using App.Domain.Enums;

namespace App.Application.DTOs
{
    public class UserResponseDto
    {
        public Guid UserId { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public Guid? OrgId { get; set; }
        public UserRoles UserRole { get; set; }

    }
}
