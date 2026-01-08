using App.Application.Interfaces;
using App.Application.DTOs;
using App.Domain.Entities;
using App.Domain.Enums;
using App.Domain.Interfaces;
using AutoMapper;

namespace App.Application.Services
{
    public class UserService(IUserRepository userRepository, IMapper mapper, ITokenservice jwtTokenService) : IUserService
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IMapper _mapper = mapper;
        private readonly ITokenservice _jwtTokenService = jwtTokenService;

        public async Task<UserResponseDto> CreateUserAsync(RegisterUserDto registerUserDto)
        {
            if (registerUserDto == null)
                throw new ArgumentNullException(nameof(registerUserDto));

            if (string.IsNullOrWhiteSpace(registerUserDto.Name))
                throw new ArgumentException("User name is required.");

            if (registerUserDto.Name.Length > 100)
                throw new ArgumentException("User name cannot exceed 100 characters.");

            if (string.IsNullOrWhiteSpace(registerUserDto.Email))
                throw new ArgumentException("User email is required.");

            if (registerUserDto.Email.Length > 150)
                throw new ArgumentException("User email cannot exceed 150 characters.");

            if (string.IsNullOrWhiteSpace(registerUserDto.UserName))
                throw new ArgumentException("UserName is required.");

            if (registerUserDto.UserName.Length > 50)
                throw new ArgumentException("UserName cannot exceed 50 characters.");

            if (string.IsNullOrWhiteSpace(registerUserDto.Password))
                throw new ArgumentException("Password is required.");

            if (registerUserDto.Password.Length > 255)
                throw new ArgumentException("Password cannot exceed 255 characters.");

            if (!string.Equals(registerUserDto.Password, registerUserDto.ConfirmPassword, StringComparison.Ordinal))
                throw new ArgumentException("Password and confirm password do not match.");

            // Org rules
            if (registerUserDto.UserRole == UserRoles.GlobalAdmin)
            {
                if (registerUserDto.OrgId.HasValue)
                    throw new ArgumentException("Global admin must not have an organization.");
            }
            else
            {
                if (!registerUserDto.OrgId.HasValue)
                    throw new ArgumentException("Organization is required for organization users and organization admins.");
            }

            var email = registerUserDto.Email.Trim();
            var userName = registerUserDto.UserName.Trim();

            // Your repo method checks Email OR UserName, so you must check both inputs
            var existingByEmail = await _userRepository.GetByEmailUsernameAsync(email);
            if (existingByEmail != null)
                throw new ArgumentException("User already exists.");

            var existingByUserName = await _userRepository.GetByEmailUsernameAsync(userName);
            if (existingByUserName != null)
                throw new ArgumentException("User already exists.");

            var user = new User
            {
                UserId = Guid.NewGuid(),
                Name = registerUserDto.Name.Trim(),
                Email = email,
                UserName = userName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerUserDto.Password),
                OrgId = registerUserDto.OrgId,
                UserRole = registerUserDto.UserRole
            };



            var createdUser = await _userRepository.CreateAsync(user);
            return _mapper.Map<UserResponseDto>(createdUser);
        }


        public async Task<LoginResponseDto> GetUserByEmailUsernameAsync(LoginDto loginDto)
        {
            var user = await _userRepository.GetByEmailUsernameAsync(loginDto.EmailUsername);
            if (user == null)
                throw new UnauthorizedAccessException("Invalid credentials.");
            bool checkPassword = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
            if (checkPassword)
            {
                var token = _jwtTokenService.GenerateJWTToken(user);
                return new LoginResponseDto {
                    Token = token, 
                    UserId = user.UserId,
                    UserName = user.UserName,
                    Name = user.Name,
                    Email = user.Email,
                    OrgId = user.OrgId,
                    UserRole = user.UserRole
                };
            }
            else
                throw new UnauthorizedAccessException("Invalid credentials.");
        }

        public async Task<UserResponseDto> GetUserByIdAsync(Guid id)
        {
            var user = await _userRepository.GetByUserIdAsync(id);
            if (user == null)
                throw new KeyNotFoundException($"User with ID {id} not found.");
            return _mapper.Map<UserResponseDto>(user);
        }


        public async Task<IEnumerable<UserResponseDto>> GetAllUsersAsync(Guid orgId)
        {
            var users = await _userRepository.GetAllAsync(orgId);
            return _mapper.Map<IEnumerable<UserResponseDto>>(users);

        }
        public async Task<IEnumerable<UserResponseDto>> GetAdminUsersAsync(Guid orgId)
        {
            var users = await _userRepository.GetAllAdminAsync(orgId);
            return _mapper.Map<IEnumerable<UserResponseDto>>(users);

        }

        public async Task<UserResponseDto> UpdateUserAsync(Guid id, EditUserDto updateUserDto)
        {
            if (updateUserDto == null)
                throw new ArgumentNullException(nameof(updateUserDto));

            var user = await _userRepository.GetByUserIdAsync(id);

            if (user == null)
                throw new KeyNotFoundException($"User with ID {id} not found.");

            if (string.IsNullOrWhiteSpace(updateUserDto.Name))
                throw new ArgumentException("User name is required.");

            if (updateUserDto.Name.Length > 100)
                throw new ArgumentException("User name cannot exceed 100 characters.");

            if (string.IsNullOrWhiteSpace(updateUserDto.Email))
                throw new ArgumentException("User email is required.");

            if (updateUserDto.Email.Length > 150)
                throw new ArgumentException("User email cannot exceed 150 characters.");

            if (string.IsNullOrWhiteSpace(updateUserDto.UserName))
                throw new ArgumentException("UserName is required.");

            if (updateUserDto.UserName.Length > 50)
                throw new ArgumentException("UserName cannot exceed 50 characters.");

            //if (string.IsNullOrWhiteSpace(updateUserDto.PasswordHash))
            //    throw new ArgumentException("Password hash is required.");

            if (updateUserDto.PasswordHash != null && updateUserDto.PasswordHash.Length > 255)
                throw new ArgumentException("Hashed password cannot exceed 255 characters.");

            var existingByEmail = await _userRepository.GetByEmailUsernameAsync(updateUserDto.Email);
            if (existingByEmail != null && existingByEmail.UserId != id)
                throw new ArgumentException("Email already exists.");

            var existingByUserName = await _userRepository.GetByEmailUsernameAsync(updateUserDto.UserName);
            if (existingByUserName != null && existingByUserName.UserId != id)
                throw new ArgumentException("User already exists.");

            user.Name = updateUserDto.Name.Trim();

            user.Email = updateUserDto.Email;

            if (updateUserDto.PasswordHash != null){
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updateUserDto.PasswordHash);
            }

            user.UserName = updateUserDto.UserName;

            user.UserRole = updateUserDto.UserRole;

            await _userRepository.UpdateAsync(user);

            return _mapper.Map<UserResponseDto>(user);
        }

        public async Task DeleteUserAsync(Guid id)
        {
            var deleted = await _userRepository.DeleteAsync(id);
            if(!deleted)
                throw new KeyNotFoundException($"User with ID {id} not found.");    
        }

    }
}
