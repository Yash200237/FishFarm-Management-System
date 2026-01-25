using App.Domain.Enums;
namespace App.Application.DTOs
{
    public class FarmWorkerDto
    {
        public Guid WorkerId { get; set; }
        public Guid FarmId { get; set; }
        public string FarmName { get; set; } = null!;
        public string WorkerName { get; set; } = null!;
        public string WorkerEmail { get; set; } = null!;
        public Roles Role { get; set; }
        public DateOnly? CertifiedUntil { get; set; }

    }
}
