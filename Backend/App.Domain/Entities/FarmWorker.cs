using App.Domain.Enums;

namespace App.Domain.Entities
{
    public class FarmWorker
    {
        public Guid FarmId { get; set; }
        public Farm Farm { get; set; } = null!;

        public Guid WorkerId { get; set; }
        public Worker Worker { get; set; } = null!;

        public Roles Role { get; set; }
        public DateOnly? CertifiedUntil { get; set; }
    }
}
