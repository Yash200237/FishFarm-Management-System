using App.Domain.Entities;
using App.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace App.Application.DTOs
{
    public class RegisterUserDto
    {

        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;

        [Required]
        public string Password{ get; set; } = null!;

        [Required,Compare(nameof(Password))]
        public string ConfirmPassword { get; set; } = null!;

        public string UserName { get; set; } = null!;
        public UserRoles UserRole { get; set; }
        public Guid? OrgId { get; set; }

    }
}
