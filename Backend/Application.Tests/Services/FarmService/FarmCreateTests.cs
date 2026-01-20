using App.Application.DTOs;
using App.Application.Services;
using App.Domain.Entities;
using App.Domain.Interfaces;
using AutoMapper;
using FluentAssertions;
using Moq;
using System.Numerics;
using System.Threading.Tasks;

namespace App.Application.Tests.Services
{
    public class FarmCreateTests
    {
        private readonly Mock<IFarmRepository> mockRepository = new();
        private readonly Mock<IMapper> mockMapper = new();

        [Fact]
        public async Task Create_FishFarm_Should_Save_Farm_And_Return_Dto()
        {
            // Arrange
            var OrgId = Guid.NewGuid();
            var requestDto = new CreateFarmDto
            {
                Name = "Test Farm   ",
                Longitude = 8,
                Latitude = 45.0m,
                NoOfCages = 10,
                HasBarge = true
            };
            var createdFarm = new Farm
            {
                FarmId = Guid.NewGuid(),
                Name = requestDto.Name.Trim(),
                Longitude = requestDto.Longitude,
                Latitude = requestDto.Latitude,
                NoOfCages = requestDto.NoOfCages,
                HasBarge = requestDto.HasBarge,
                OrgId = OrgId,
            };
            var expectedResponse = new FarmResponseDto
            {
                FarmId = createdFarm.FarmId,
                Name = createdFarm.Name,
                Longitude = createdFarm.Longitude,
                Latitude = createdFarm.Latitude,
                NoOfCages = createdFarm.NoOfCages,
                HasBarge = createdFarm.HasBarge,
                Picture = createdFarm.Picture!,
                Phone = createdFarm.Phone!
            };

            mockRepository.Setup(r => r.CreateAsync(It.IsAny<Farm>())).ReturnsAsync(createdFarm);
            mockMapper.Setup(m => m.Map<FarmResponseDto>(createdFarm)).Returns(expectedResponse);

            var fService = new FarmService (mockRepository.Object, mockMapper.Object);

            //Act
            var result = await fService.CreateFarmAsync(OrgId, requestDto);

            //Assert
            result.Should().NotBeNull();
            result.Should().Be(expectedResponse);

            mockRepository.Verify(
                r => r.CreateAsync(It.Is<Farm>(f =>
                    f.OrgId == OrgId &&
                    f.FarmId != Guid.Empty &&
                    f.Name == requestDto.Name.Trim() &&
                    f.Longitude == requestDto.Longitude &&
                    f.Latitude == requestDto.Latitude &&
                    f.NoOfCages == requestDto.NoOfCages &&
                    f.HasBarge == requestDto.HasBarge 
            )), Times.Once);

            mockMapper.Verify(m => m.Map<FarmResponseDto>(createdFarm), Times.Once);

        }


        [Fact]
        public async Task Create_FishFarm_Should_Throw_Exception_When_Request_Is_Null()
        {
            // Arrange
            var OrgId = Guid.NewGuid();
            CreateFarmDto? createFarmDto = null;

            var fService = new FarmService(mockRepository.Object, mockMapper.Object);

            //Act & Assert
            var act = async () => await fService.CreateFarmAsync(OrgId, createFarmDto!);
            await act.Should().ThrowAsync<ArgumentNullException>().Where(e => e.ParamName == "createFarmDto");
            mockRepository.Verify(
                r => r.CreateAsync(It.IsAny<Farm>()), Times.Never
            );
        }


        [Fact]
        public async Task Create_FishFarm_Should_Throw_Exception_When_Longitude_Is_OutOfRange()
        {
            // Arrange
            var OrgId = Guid.NewGuid();
            var requestDto = new CreateFarmDto
            {
                Name = "Test Farm",
                Longitude = 888,
                Latitude = 45.0m,
                NoOfCages = 10,
                HasBarge = true
            };

            var fService = new FarmService(mockRepository.Object, mockMapper.Object);

            //Act & Assert
            var act = async () => await fService.CreateFarmAsync(OrgId, requestDto);
            await act.Should().ThrowAsync<ArgumentException>().WithMessage("Longitude must be between -180 and 180.");
            mockRepository.Verify(
                r => r.CreateAsync(It.IsAny<Farm>()), Times.Never
            );
        }

        [Fact]
        public async Task Create_FishFarm_Should_Throw_Exception_When_Latitude_Is_OutOfRange()
        {
            // Arrange
            var OrgId = Guid.NewGuid();
            var requestDto = new CreateFarmDto
            {
                Name = "Test Farm",
                Longitude = 88,
                Latitude = -200,
                NoOfCages = 10,
                HasBarge = true
            };

            var fService = new FarmService(mockRepository.Object, mockMapper.Object);

            //Act & Assert
            var act = async () => await fService.CreateFarmAsync(OrgId, requestDto);
            await act.Should().ThrowAsync<ArgumentException>().WithMessage("Latitude must be between -90 and 90.");
            mockRepository.Verify(
                r => r.CreateAsync(It.IsAny<Farm>()), Times.Never
            );
        }

        [Fact]
        public async Task Create_FishFarm_Should_Throw_Exception_When_FarmName_Is_NotGiven()
        {
            // Arrange
            var OrgId = Guid.NewGuid();
            var requestDto = new CreateFarmDto
            {
                Name = "  ",
                Longitude = 88,
                Latitude =  5,
                NoOfCages = 10,
                HasBarge = true
            };

            var fService = new FarmService(mockRepository.Object, mockMapper.Object);

            //Act & Assert
            var act = async () => await fService.CreateFarmAsync(OrgId, requestDto);
            await act.Should().ThrowAsync<ArgumentException>().WithMessage("Farm name is required.");
            mockRepository.Verify(
                r => r.CreateAsync(It.IsAny<Farm>()), Times.Never
            );
        }

        [Fact]
        public async Task Create_FishFarm_Should_Throw_Exception_When_FarmName_Is_Loo_Long()
        {
            // Arrange
            var OrgId = Guid.NewGuid();
            var requestDto = new CreateFarmDto
            {
                Name = new string('a', 101),
                Longitude = 88,
                Latitude = 5,
                NoOfCages = 10,
                HasBarge = true
            };

            var fService = new FarmService(mockRepository.Object, mockMapper.Object);

            //Act & Assert
            var act = async () => await fService.CreateFarmAsync(OrgId, requestDto);
            await act.Should().ThrowAsync<ArgumentException>().WithMessage("Farm name cannot exceed 100 characters.");
            mockRepository.Verify(
                r => r.CreateAsync(It.IsAny<Farm>()), Times.Never
            );
        }

        [Fact]
        public async Task Create_FishFarm_Should_Throw_Exception_When_NoOfCages_Is_Zero()
        {
            // Arrange
            var OrgId = Guid.NewGuid();
            var requestDto = new CreateFarmDto
            {
                Name = "Test Farm",
                Longitude = 88,
                Latitude = -20,
                NoOfCages = 0,
                HasBarge = true
            };

            var fService = new FarmService(mockRepository.Object, mockMapper.Object);

            //Act & Assert
            var act = async () => await fService.CreateFarmAsync(OrgId, requestDto);
            await act.Should().ThrowAsync<ArgumentException>().WithMessage("Number of cages must be greater than 0.");
            mockRepository.Verify(
                r => r.CreateAsync(It.IsAny<Farm>()), Times.Never
            );
        }
    }
}