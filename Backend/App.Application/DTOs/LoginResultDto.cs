using App.Domain.Enums;

namespace App.Application.DTOs
{
    public class LoginResultDto
    {
        public LoginResponseDto Dto { get; set; } = null!;
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiry { get; set; }
    }
}
