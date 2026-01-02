using App.Domain.Entities;
using App.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
