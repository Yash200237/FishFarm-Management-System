using App.Application.DTOs;

namespace App.Application.Interfaces
{
    public interface IFarmService
    {
        Task<FarmResponseDto> CreateFarmAsync(Guid orgId, CreateFarmDto createFarmDto);
        Task<FarmResponseDto> GetFarmByIdAsync(Guid Id, Guid orgId);
        Task<IEnumerable<FarmResponseDto>> GetAllFarmsAsync(Guid orgId);
        Task<FarmResponseDto> UpdateFarmAsync(Guid id, UpdateFarmDto updateFarmDto, Guid orgId);
        Task DeleteFarmAsync(Guid id, Guid orgId);
    }
}
