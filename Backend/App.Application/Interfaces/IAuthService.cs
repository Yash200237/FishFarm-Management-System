using App.Application.DTOs;
using App.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Application.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResultDto> GetUserByEmailUsernameAsync(LoginDto loginUserDto);
        Task<LoginResultDto> RefreshToken(string refreshToken);
        Task<Boolean> RemoveRefreshTokenAsync(string refreshToken);

    }
}
