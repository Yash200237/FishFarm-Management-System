using App.Application.DTOs;

namespace App.Application.Interfaces
{
    public interface IFarmWorkerService
    {
        Task<IEnumerable<FarmWorkerDetailsDto>> GetWorkers(Guid farmId);   //list workers of a farm
        Task<IEnumerable<FarmWDetailsDto>> GetFarms(Guid WorkerId); //list farms of a worker
        Task<WorkerToFarmDto> AssignWorker(WorkerToFarmDto workerToFarmDto); //assign worker to farm
        Task<WorkerToFarmDto> ModifyAssignment(WorkerToFarmDto workerToFarmDto); //update role and certified until
        Task RemoveWorker(Guid WorkerId, Guid FarmId);  //remove worker from farm
        Task<IEnumerable<WorkerResponseDto>> GetUnassignedWorkers(Guid orgId);
        Task<IEnumerable<WorkerResponseDto>> GetFarmWorkersUnassigned(Guid orgId, Guid farmId);




    }
}






