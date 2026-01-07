using App.Application.DTOs;
using App.Application.Interfaces;
using App.Domain.Entities;
using App.Domain.Interfaces;
using AutoMapper;
using System.Linq;

namespace App.Application.Services
{
    public class OrgService(IOrgRepository orgRepository,IFarmRepository farmRepository,IWorkerRepository workerRepository,IUserRepository userRepository, IMapper mapper) : IOrgService
    {
        private readonly IOrgRepository _orgRepository = orgRepository;
        private readonly IMapper _mapper = mapper;
        private readonly IFarmRepository _farmRepository = farmRepository;
        private readonly IWorkerRepository _workerRepository = workerRepository;
        private readonly IUserRepository _userRepository = userRepository;

        public async Task<OrgResponseDto> CreateOrgAsync(OrgDto orgDto)
        {
            if (orgDto == null)
                throw new ArgumentNullException(nameof(orgDto));

            if (string.IsNullOrWhiteSpace(orgDto.Name))
                throw new ArgumentException("Organization name is required.");

            if (orgDto.Name.Length > 100)
                throw new ArgumentException("Organization name cannot exceed 100 characters.");

            if (string.IsNullOrWhiteSpace(orgDto.Description))
                throw new ArgumentException("Organization description is required.");

            if (orgDto.Description.Length > 500)
                throw new ArgumentException("Organization description cannot exceed 500 characters.");

            //if (!string.IsNullOrEmpty(orgDto.Logo) && orgDto.Logo.Length > 500)
            //    throw new ArgumentException("Organization Logo cannot exceed 500.");

            var org = new Org
            {
                OrgId = Guid.NewGuid(),
                Name = orgDto.Name.Trim(),
                Description = orgDto.Description,
                Logo = orgDto.Logo,
            };

            var createdOrg = await _orgRepository.CreateAsync(org);
            return _mapper.Map<OrgResponseDto>(createdOrg);
        }

        public async Task<OrgResponseDto> GetOrgByIdAsync(Guid id)
        {
            var org = await _orgRepository.GetByIdAsync(id);
            if (org == null)
                throw new KeyNotFoundException($"Organization with ID {id} not found.");
            return _mapper.Map<OrgResponseDto>(org);
        }

        public async Task<IEnumerable<OrgResponseDto>> GetAllOrgsAsync()
        {
            var orgs = await _orgRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<OrgResponseDto>>(orgs);

        }

        public async Task<OrgResponseDto> UpdateOrgAsync(Guid id, OrgDto updateOrgDto)
        {
            if (updateOrgDto == null)
                throw new ArgumentNullException(nameof(updateOrgDto));

            var org = await _orgRepository.GetByIdAsync(id);

            if (org == null)
                throw new KeyNotFoundException($"Organization with ID {id} not found.");

            if (string.IsNullOrWhiteSpace(updateOrgDto.Name))
                    throw new ArgumentException("Organization name cannot be empty.");

            if (updateOrgDto.Name.Length > 100)
                throw new ArgumentException("Organization name cannot exceed 100 characters.");

            if (string.IsNullOrWhiteSpace(updateOrgDto.Description))
                throw new ArgumentException("Organization description is required.");

            if (updateOrgDto.Description.Length > 500)
                throw new ArgumentException("Organization description cannot exceed 500 characters.");

            //if (!string.IsNullOrEmpty(updateOrgDto.Logo) && updateOrgDto.Logo.Length > 500)
            //    throw new ArgumentException("Organization Logo cannot exceed 500.");

            org.Name = updateOrgDto.Name.Trim();

            org.Description = updateOrgDto.Description;

            org.Logo = updateOrgDto.Logo;

            await _orgRepository.UpdateAsync(org);

            return _mapper.Map<OrgResponseDto>(org);
        }

        public async Task DeleteOrgAsync(Guid id)
        {
            var farms = await _farmRepository.GetAllAsync(id);
            if (farms.Any()) {
                throw new ArgumentException("Organization have existing farms.");
            }
            var workers = await _workerRepository.GetAllAsync(id);
            if (workers.Any())
            {
                throw new ArgumentException("Organization have existing worker.");
            }
            var users = await _userRepository.GetAllAsync(id);
            if (users.Any())
            {
                throw new ArgumentException("Organization have existing users.");
            }
            var deleted = await _orgRepository.DeleteAsync(id);
            if(!deleted)
                throw new KeyNotFoundException($"Organization with ID {id} not found.");    
        }

    }
}
