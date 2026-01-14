using App.Application.DTOs;

namespace App.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserResponseDto> CreateUserAsync(RegisterUserDto createUserDto);
        Task<UserResponseDto> GetUserByIdAsync(Guid id);
        Task<IEnumerable<UserResponseDto>> GetAllUsersAsync(Guid orgId);
        Task<IEnumerable<UserResponseDto>> GetAdminUsersAsync(Guid orgId);
        Task<UserResponseDto> UpdateUserAsync(Guid id, EditUserDto updateUserDto);
        Task DeleteUserAsync(Guid id);

    }
}