namespace App.Domain.Entities
{
    public class Worker
    {
        public Guid WorkerId { get; set; }
        public string Name { get; set; } = null!;
        public int Age { get; set; }
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string? Picture { get; set; }
        public Guid OrgId { get; set; }
        public Org Org { get; set; } = null!;
        public ICollection<FarmWorker> FarmWorkers { get; set; } = new List<FarmWorker>();

    }
}
