using App.Application.Interfaces;
using App.Application.DTOs;
using App.Domain.Entities;
using App.Domain.Enums;
using App.Domain.Interfaces;
using AutoMapper;

namespace App.Application.Services
{
    public class FarmWorkerService(IFarmWorkerRepository farmWorkerRepository, IMapper mapper, IFarmRepository farmRepository,IWorkerRepository workerRepository) : IFarmWorkerService
    {
        private readonly IFarmWorkerRepository _farmWorkerRepository = farmWorkerRepository;
        private readonly IMapper _mapper = mapper;
        private readonly IFarmRepository _farmRepository = farmRepository;
        private readonly IWorkerRepository _workerRepository = workerRepository;

        public async Task<IEnumerable<FarmWorkerDetailsDto>> GetWorkers(Guid farmId)
        {
            var farmworkers = await _farmWorkerRepository.GetWorkersForFarmId(farmId);
            return _mapper.Map<IEnumerable<FarmWorkerDetailsDto>>(farmworkers);
        }

        public async Task<IEnumerable<FarmWDetailsDto>> GetFarms(Guid workerId)
        {
            var farmworkers = await _farmWorkerRepository.GetFarmsForWorkerId(workerId);
            return _mapper.Map<IEnumerable<FarmWDetailsDto>>(farmworkers);
        }
        public async Task<IEnumerable<WorkerResponseDto>> GetUnassignedWorkers(Guid orgId)
        {
            var workers = await _farmWorkerRepository.GetWorkersUnassigned(orgId);
            return _mapper.Map<IEnumerable<WorkerResponseDto>>(workers);
        }

        public async Task<WorkerToFarmDto> AssignWorker(WorkerToFarmDto workerToFarmDto)
        {
            if (workerToFarmDto == null)
                throw new ArgumentNullException(nameof(workerToFarmDto));

            if (workerToFarmDto.FarmId == Guid.Empty)
                throw new ArgumentException("FarmId is required.");

            if (workerToFarmDto.WorkerId == Guid.Empty)
                throw new ArgumentException("WorkerId is required.");

            if (workerToFarmDto.Role == null || !Enum.IsDefined(typeof(Roles), workerToFarmDto.Role.Value))
                throw new ArgumentException("Invalid role.");

            if (workerToFarmDto.CertifiedUntil.HasValue &&
                workerToFarmDto.CertifiedUntil.Value < DateOnly.FromDateTime(DateTime.Now))
                throw new ArgumentException("CertifiedUntil cannot be in the past.");

            var CEO = await _farmRepository.GetByIdAsync(workerToFarmDto.FarmId);

            var farm = await _farmRepository.GetByIdAsync(workerToFarmDto.FarmId);
            if (farm == null)
                throw new KeyNotFoundException($"Farm with ID {workerToFarmDto.FarmId} not found.");

            var worker = await _workerRepository.GetByIdAsync(workerToFarmDto.WorkerId);
            if (worker == null)
                throw new KeyNotFoundException($"Worker with ID {workerToFarmDto.WorkerId} not found.");

            var existingAssignment = await _farmWorkerRepository.GetByIdAsync(workerToFarmDto.FarmId, workerToFarmDto.WorkerId);
            if (existingAssignment != null)
                throw new ArgumentException("Worker already assigned to this farm.");

            var farmWorker = new FarmWorker
            {
                FarmId = workerToFarmDto.FarmId,
                WorkerId = workerToFarmDto.WorkerId,
                Role = (Roles)workerToFarmDto.Role,  
                CertifiedUntil = workerToFarmDto.CertifiedUntil,

            };

            var createdFarmWorker = await _farmWorkerRepository.CreateAsync(farmWorker);
            return _mapper.Map<WorkerToFarmDto>(createdFarmWorker);
        }

        public async Task<WorkerToFarmDto> ModifyAssignment(WorkerToFarmDto workerToFarmDto)
        {
            if (workerToFarmDto == null)
                throw new ArgumentNullException(nameof(workerToFarmDto));

            if (workerToFarmDto.FarmId == Guid.Empty)
                throw new ArgumentException("FarmId is required.");

            if (workerToFarmDto.WorkerId == Guid.Empty)
                throw new ArgumentException("WorkerId is required.");

            if (workerToFarmDto.Role == null || !Enum.IsDefined(typeof(Roles), workerToFarmDto.Role.Value))
                throw new ArgumentException("Invalid role.");

            if (workerToFarmDto.CertifiedUntil.HasValue &&
                workerToFarmDto.CertifiedUntil.Value < DateOnly.FromDateTime(DateTime.Now))
                throw new ArgumentException("CertifiedUntil cannot be in the past.");


            var farmWorker = await _farmWorkerRepository.GetByIdAsync(workerToFarmDto.FarmId , workerToFarmDto.WorkerId );

            if (farmWorker == null)
                throw new KeyNotFoundException($"Assignment not found.");


            farmWorker.Role = (Roles)workerToFarmDto.Role;

            farmWorker.CertifiedUntil = workerToFarmDto.CertifiedUntil;

            await _farmWorkerRepository.UpdateAsync(farmWorker);

            return _mapper.Map<WorkerToFarmDto>(farmWorker);
        }

        public async Task RemoveWorker(Guid workerId, Guid farmId)
        { 
            var deleted = await _farmWorkerRepository.DeleteAsync(workerId, farmId);
            if (!deleted)
                throw new KeyNotFoundException($"Worker {workerId} could not be removed from farm {farmId}.");

        }
    }
}
