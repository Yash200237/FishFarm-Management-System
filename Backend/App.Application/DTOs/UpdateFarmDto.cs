using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Application.DTOs
{
    public class UpdateFarmDto
    {
        public string Name { get; set; } = null!;
        public decimal Longitude { get; set; }
        public decimal Latitude { get; set; }
        public int NoOfCages { get; set; }
        public bool HasBarge { get; set; }
        public string? Phone { get; set; }
        public string? Picture { get; set; }
    }
}
