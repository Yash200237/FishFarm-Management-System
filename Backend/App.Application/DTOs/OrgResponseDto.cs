namespace App.Application.DTOs
{
    public class OrgResponseDto
    {
        public Guid OrgId { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string? Logo { get; set; }

    }
}
