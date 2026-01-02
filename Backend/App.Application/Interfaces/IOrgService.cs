using App.Application.DTOs;

namespace App.Application.Interfaces
{
    public interface IOrgService
    {
        Task<OrgResponseDto> CreateOrgAsync(OrgDto orgDto);
        Task<OrgResponseDto> GetOrgByIdAsync(Guid id);
        Task<IEnumerable<OrgResponseDto>> GetAllOrgsAsync();
        Task<OrgResponseDto> UpdateOrgAsync(Guid id, OrgDto updateOrgDto);
        Task DeleteOrgAsync(Guid id);
            
    }
}