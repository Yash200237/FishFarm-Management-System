using App.Application.DTOs;

namespace App.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserResponseDto> CreateUserAsync(RegisterUserDto createUserDto);
        Task<LoginResponseDto> GetUserByEmailUsernameAsync(LoginDto loginUserDto);
        Task<UserResponseDto> GetUserByIdAsync(Guid id);
        Task<IEnumerable<UserResponseDto>> GetAllUsersAsync(Guid orgId);
        Task<IEnumerable<UserResponseDto>> GetAdminUsersAsync(Guid orgId);
        Task<UserResponseDto> UpdateUserAsync(Guid id, UserDto updateUserDto);
        Task DeleteUserAsync(Guid id);

    }
}