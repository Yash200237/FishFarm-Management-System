using App.Domain.Enums;

namespace App.Application.DTOs
{
    public class WorkerToFarmDto
    {
        public Guid FarmId { get; set; }
        public Guid WorkerId { get; set; }
        public Roles? Role { get; set; }
        public DateOnly? CertifiedUntil { get; set; }
    }
}
