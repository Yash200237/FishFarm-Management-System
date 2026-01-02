using App.Domain.Enums;
namespace App.Application.DTOs
{
    public class FarmWorkerDetailsDto
    {
        public Guid WorkerId { get; set; }
        public string WorkerName { get; set; } = null!;
        public string WorkerEmail { get; set; } = null!;
        public Roles Role { get; set; }
        public DateOnly? CertifiedUntil { get; set; }
    }
}
