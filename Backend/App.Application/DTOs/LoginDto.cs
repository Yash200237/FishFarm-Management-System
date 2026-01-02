using App.Domain.Entities;
using App.Domain.Enums;

namespace App.Application.DTOs
{
    public class LoginDto
    {
        public string EmailUsername { get; set; } = null!;
        public string Password { get; set; } = null!;

    }
}
