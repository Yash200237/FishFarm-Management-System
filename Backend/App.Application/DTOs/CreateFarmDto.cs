namespace App.Application.DTOs
{
    public class CreateFarmDto
    {
        public string Name { get; set; } = null!;
        public decimal Longitude { get; set; }
        public decimal Latitude { get; set; }
        public int NoOfCages { get; set; }
        public bool HasBarge { get; set; }
    }
}
