using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Domain.Entities
{
    public class Farm
    {
        public Guid FarmId { get; set; }
        public string Name { get; set; } = null!;
        public decimal Longitude { get; set; }
        public decimal Latitude { get; set; }
        public int NoOfCages { get; set; }
        public string? Picture{ get; set; }
        public bool HasBarge { get; set; } 
        public string? Phone { get; set; }
        public Guid OrgId { get; set; }
        public Org Org { get; set; }=null!;
        public ICollection<FarmWorker> FarmWorkers { get; set; } = new List<FarmWorker>();


    }
}
