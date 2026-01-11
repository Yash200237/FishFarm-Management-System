using App.Application.DTOs;
using App.Application.Interfaces;
using App.Domain.Entities;
using App.Domain.Interfaces;
using AutoMapper;
using System.Security.Cryptography;

namespace App.Application.Services
{
    public class WorkerService(IWorkerRepository workerRepository, IMapper mapper) : IWorkerService
    {
        private readonly IWorkerRepository _workerRepository = workerRepository;
        private readonly IMapper _mapper = mapper;

        public async Task<WorkerResponseDto> CreateWorkerAsync(Guid orgId , CreateWorkerDto createWorkerDto)
        {
            if (createWorkerDto == null)
                throw new ArgumentNullException(nameof(createWorkerDto));

            if (string.IsNullOrWhiteSpace(createWorkerDto.Name))
                throw new ArgumentException("Worker name is required.");

            if (createWorkerDto.Name.Length > 100)
                throw new ArgumentException("Worker name cannot exceed 100 characters.");

            if (string.IsNullOrWhiteSpace(createWorkerDto.Email))
                throw new ArgumentException("Worker email is required.");

            if (createWorkerDto.Email.Length > 150)
                throw new ArgumentException("Worker email cannot exceed 150 characters.");

            if (createWorkerDto.Age <= 0)
                throw new ArgumentException("Age must be greater than 0.");

            var worker = new Worker
            {
                WorkerId = Guid.NewGuid(),
                Name = createWorkerDto.Name.Trim(),
                Email = createWorkerDto.Email,
                Age = createWorkerDto.Age,
                Phone = createWorkerDto.Phone,
                OrgId = orgId
            };

            var createdWorker = await _workerRepository.CreateAsync(worker);
            return _mapper.Map<WorkerResponseDto>(createdWorker);

        }

        public async Task<WorkerResponseDto> GetWorkerByIdAsync(Guid id, Guid orgId)
        {
            var worker = await _workerRepository.GetByIdAsync(id, orgId);
            if (worker == null)
                throw new KeyNotFoundException($"Worker with ID {id} not found.");
            return _mapper.Map<WorkerResponseDto>(worker);
        }

        public async Task<IEnumerable<WorkerResponseDto>> GetAllWorkersAsync(Guid orgId)
        {
            var workers = await _workerRepository.GetAllAsync(orgId);
            return _mapper.Map<IEnumerable<WorkerResponseDto>>(workers);

        }

        public async Task<WorkerResponseDto> UpdateWorkerAsync(Guid id, UpdateWorkerDto updateWorkerDto, Guid orgId)
        {
            if (updateWorkerDto == null)
                throw new ArgumentNullException(nameof(updateWorkerDto));

            var worker = await _workerRepository.GetByIdAsync(id, orgId);

            if (worker == null)
                throw new KeyNotFoundException($"Worker with ID {id} not found.");

            if (string.IsNullOrWhiteSpace(updateWorkerDto.Name))
                throw new ArgumentException("Worker name cannot be empty.");

            if (updateWorkerDto.Name.Length > 100)
                throw new ArgumentException("Worker name cannot exceed 100 characters.");

            if (string.IsNullOrWhiteSpace(updateWorkerDto.Email))
                throw new ArgumentException("Worker email is required.");

            if (updateWorkerDto.Email.Length > 150)
                throw new ArgumentException("Worker email cannot exceed 150 characters.");

            if (updateWorkerDto.Age <= 0)
                throw new ArgumentException("Age must be greater than 0.");

            worker.Name = updateWorkerDto.Name;
            worker.Email = updateWorkerDto.Email;
            worker.Age = updateWorkerDto.Age;
            worker.Phone = updateWorkerDto.Phone;
            worker.Picture = updateWorkerDto.Picture;

            await _workerRepository.UpdateAsync(worker);

            return _mapper.Map<WorkerResponseDto>(worker);
        }

        public async Task DeleteWorkerAsync(Guid id,Guid orgId)
        {
            var deleted = await _workerRepository.DeleteAsync(id, orgId);
            if (!deleted)
                throw new KeyNotFoundException($"Worker with ID {id} not found.");
        }

    }
}
