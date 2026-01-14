using App.Application.Interfaces;
using App.Application.DTOs;
using App.Domain.Entities;
using App.Domain.Enums;
using App.Domain.Interfaces;
using AutoMapper;

namespace App.Application.Services
{
    public class AuthService(IUserRepository userRepository, IMapper mapper,ITokenService tokenService ) : IAuthService
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly ITokenService _jwtTokenService = tokenService;


        public async Task<LoginResultDto> GetUserByEmailUsernameAsync(LoginDto loginDto)
        {
            var user = await _userRepository.GetByEmailUsernameAsync(loginDto.EmailUsername);
            if (user == null)
                throw new UnauthorizedAccessException("Invalid credentials.");
            bool checkPassword = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
            if (checkPassword)
            {
                var token = _jwtTokenService.GenerateJWTToken(user);
                var refreshToken = _jwtTokenService.GenerateRefreshToken();
                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
                await _userRepository.UpdateAsync(user);
                return new LoginResultDto
                {
                    Dto = new LoginResponseDto
                    {
                        Token = token,
                        UserId = user.UserId,
                        UserName = user.UserName,
                        Name = user.Name,
                        Email = user.Email,
                        OrgId = user.OrgId,
                        UserRole = user.UserRole
                    },
                    RefreshToken = refreshToken,
                    RefreshTokenExpiry = (DateTime)user.RefreshTokenExpiry
                };
            }
            else
                throw new UnauthorizedAccessException("Invalid credentials.");
        }

        public async Task<LoginResultDto> RefreshToken(string refreshToken)
        {
            var user = await _userRepository.GetByRefreshTokenAsync(refreshToken);
            if (user == null)
                throw new UnauthorizedAccessException("Invalid refresh token.");

            if (user.RefreshTokenExpiry == null || user.RefreshTokenExpiry <= DateTime.UtcNow)
                throw new UnauthorizedAccessException("Refresh token expired.");

            var newAccessToken = _jwtTokenService.GenerateJWTToken(user);

            var newRefreshToken = _jwtTokenService.GenerateRefreshToken();
            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            await _userRepository.UpdateAsync(user);
            return new LoginResultDto
            {
                Dto = new LoginResponseDto
                {
                    Token = newAccessToken,
                    UserId = user.UserId,
                    UserName = user.UserName,
                    Name = user.Name,
                    Email = user.Email,
                    OrgId = user.OrgId,
                    UserRole = user.UserRole
                },
                RefreshToken = newRefreshToken,
                RefreshTokenExpiry = (DateTime)user.RefreshTokenExpiry,
            };
        }

        public async Task<Boolean> RemoveRefreshTokenAsync(string refreshToken)
        {
            var user = await _userRepository.GetByRefreshTokenAsync(refreshToken);
            if (user == null) return false;

            user.RefreshToken = null;
            user.RefreshTokenExpiry = null;

            await _userRepository.UpdateAsync(user);
            return true;
        }






    }


}
