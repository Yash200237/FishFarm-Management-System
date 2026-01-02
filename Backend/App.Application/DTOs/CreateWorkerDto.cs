namespace App.Application.DTOs
{
    // Renamed to avoid duplicate definition error CS0101
    public class CreateWorkerDto
    {
        public string Name { get; set; } = null!;
        public int Age { get; set; }
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;
    }
}
