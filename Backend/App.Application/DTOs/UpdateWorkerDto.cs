namespace App.Application.DTOs
{
    public class UpdateWorkerDto
    {
        public Guid WorkerId { get; set; }
        public string Name { get; set; } = null!;
        public int Age { get; set; }
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string? Picture { get; set; }
    }
}
