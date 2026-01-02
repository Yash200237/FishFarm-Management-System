using App.Domain.Enums;
namespace App.Application.DTOs
{
    public class FarmWDetailsDto
    {
        public Guid FarmId { get; set; }
        public string FarmName { get; set; } = null!;
        public Roles Role { get; set; }
        public DateOnly? CertifiedUntil { get; set; }
    }
}
