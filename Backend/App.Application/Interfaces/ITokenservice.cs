using App.Domain.Entities;

namespace App.Application.Interfaces
{
    public interface ITokenservice
    {
        string GenerateJWTToken(User user);
    }
}
