namespace App.Domain.Entities
{
    public  class Org
    {
        public Guid OrgId { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string? Logo { get; set; }
        public ICollection<Farm> Farms { get; set; } = new List<Farm>();
        public ICollection<Worker> Workers { get; set; } = new List<Worker>();
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}
