namespace App.Application.DTOs
{
    public class FarmResponseDto
    {
        public Guid FarmId { get; set; }
        public string Name { get; set; } = null!;
        public decimal Longitude { get; set; }
        public decimal Latitude { get; set; }
        public int NoOfCages { get; set; }
        public string Picture { get; set; } = null!;
        public bool HasBarge { get; set; }
        public string Phone { get; set; } = null!;
    }
}
