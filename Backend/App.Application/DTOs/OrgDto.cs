using App.Domain.Entities;

namespace App.Application.DTOs
{
    public class OrgDto
    {
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string? Logo { get; set; }

    }
}
