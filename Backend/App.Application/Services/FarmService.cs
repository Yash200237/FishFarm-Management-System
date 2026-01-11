using App.Application.Interfaces;
using App.Application.DTOs;
using App.Domain.Entities;
using App.Domain.Interfaces;
using AutoMapper;

namespace App.Application.Services
{
    public class FarmService(IFarmRepository farmRepository, IMapper mapper) : IFarmService
    {
        private readonly IFarmRepository _farmRepository = farmRepository;
        private readonly IMapper _mapper = mapper;

        public async Task<FarmResponseDto> CreateFarmAsync(Guid orgId, CreateFarmDto createFarmDto)
        {
            if (createFarmDto == null)
                throw new ArgumentNullException(nameof(createFarmDto));

            if (string.IsNullOrWhiteSpace(createFarmDto.Name))
                throw new ArgumentException("Farm name is required.");

            if (createFarmDto.Name.Length > 100)
                throw new ArgumentException("Farm name cannot exceed 100 characters.");

            if (createFarmDto.NoOfCages <= 0)
                throw new ArgumentException("Number of cages must be greater than 0.");

            if (createFarmDto.Longitude < -180 || createFarmDto.Longitude > 180)
                throw new ArgumentException("Longitude must be between -180 and 180.");

            if (createFarmDto.Latitude < -90 || createFarmDto.Latitude > 90)
                throw new ArgumentException("Latitude must be between -90 and 90.");

            var farm = new Farm
            {
                FarmId = Guid.NewGuid(),
                Name = createFarmDto.Name.Trim(),
                Longitude = Convert.ToDecimal(createFarmDto.Longitude),
                Latitude = Convert.ToDecimal(createFarmDto.Latitude),
                NoOfCages = createFarmDto.NoOfCages,
                HasBarge = createFarmDto.HasBarge,
                OrgId = orgId
            };

            var createdFarm = await _farmRepository.CreateAsync(farm);
            return _mapper.Map<FarmResponseDto>(createdFarm);

        }

        public async Task<FarmResponseDto> GetFarmByIdAsync(Guid id,Guid orgId)
        {
            var farm = await _farmRepository.GetByIdAsync(id, orgId);
            if (farm == null)
                throw new KeyNotFoundException($"Farm with ID {id} not found.");
            return _mapper.Map<FarmResponseDto>(farm);
        }

        public async Task<IEnumerable<FarmResponseDto>> GetAllFarmsAsync(Guid orgId)
        {
            var farms = await _farmRepository.GetAllAsync(orgId);
            return _mapper.Map<IEnumerable<FarmResponseDto>>(farms);

        }

        public async Task<FarmResponseDto> UpdateFarmAsync(Guid id, UpdateFarmDto updateFarmDto, Guid orgId)
        {
            if (updateFarmDto == null)
                throw new ArgumentNullException(nameof(updateFarmDto));

            var farm = await _farmRepository.GetByIdAsync(id,orgId);

            if (farm == null)
                throw new KeyNotFoundException($"Farm with ID {id} not found.");

            if (string.IsNullOrWhiteSpace(updateFarmDto.Name))
                    throw new ArgumentException("Farm name cannot be empty.");

            if (updateFarmDto.Name.Length > 100)
                throw new ArgumentException("Farm name cannot exceed 100 characters.");

            if (updateFarmDto.Longitude < -180 || updateFarmDto.Longitude > 180)
                throw new ArgumentException("Longitude must be between -180 and 180.");

            if (updateFarmDto.Latitude < -90 || updateFarmDto.Latitude > 90)
                    throw new ArgumentException("Latitude must be between -90 and 90.");

            if (updateFarmDto.NoOfCages <= 0)
                    throw new ArgumentException("Number of cages must be greater than 0.");

            farm.Latitude = updateFarmDto.Latitude;

            farm.Longitude = updateFarmDto.Longitude;

            farm.Name = updateFarmDto.Name.Trim();

            farm.NoOfCages = updateFarmDto.NoOfCages;

            farm.HasBarge = updateFarmDto.HasBarge;

            farm.Phone = updateFarmDto.Phone;

            farm.Picture = updateFarmDto.Picture;

            await _farmRepository.UpdateAsync(farm);

            return _mapper.Map<FarmResponseDto>(farm);
        }

        public async Task DeleteFarmAsync(Guid id,Guid orgId)
        {
            var deleted = await _farmRepository.DeleteAsync(id, orgId);
            if (!deleted)
                throw new KeyNotFoundException($"Farm with ID {id} not found.");    
        }

    }
}
