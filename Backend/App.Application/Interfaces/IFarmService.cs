using App.Application.DTOs;

namespace App.Application.Interfaces
{
    public interface IFarmService
    {
        Task<FarmResponseDto> CreateFarmAsync(Guid orgId, CreateFarmDto createFarmDto);
        Task<FarmResponseDto> GetFarmByIdAsync(Guid Id);
        Task<IEnumerable<FarmResponseDto>> GetAllFarmsAsync(Guid orgId);
        Task<FarmResponseDto> UpdateFarmAsync(Guid id, UpdateFarmDto updateFarmDto);
        Task DeleteFarmAsync(Guid id);
    }
}
