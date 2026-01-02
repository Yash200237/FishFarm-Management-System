using App.Application.DTOs;
using App.Domain.Entities;
using AutoMapper;

namespace App.Application.Mapping
{
    public class FarmMappingProfle : Profile
    {
        public FarmMappingProfle()
        {
            CreateMap<Farm, FarmResponseDto>();
            CreateMap<Worker, WorkerResponseDto>();
            CreateMap<FarmWorker, WorkerToFarmDto>();
            CreateMap<User, UserResponseDto>();
            CreateMap<Org, OrgResponseDto>();
            CreateMap<FarmWorker, FarmWorkerDetailsDto>()
                    .ForMember(dest => dest.WorkerName,
                               opt => opt.MapFrom(src => src.Worker.Name))
                    .ForMember(dest => dest.WorkerEmail,
                               opt => opt.MapFrom(src => src.Worker.Email));
            CreateMap<FarmWorker, FarmWDetailsDto>()
                    .ForMember(dest => dest.FarmName,
                               opt => opt.MapFrom(src => src.Farm.Name));

        }
    }
}
