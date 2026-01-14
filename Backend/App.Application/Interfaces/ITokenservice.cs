using App.Application.DTOs;
using App.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Application.Interfaces
{
    public interface ITokenService
    {
        string GenerateJWTToken(User user);
        string GenerateRefreshToken();

    }
}
