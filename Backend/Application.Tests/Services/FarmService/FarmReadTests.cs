using App.Application.DTOs;
using App.Application.Services;
using App.Domain.Entities;
using App.Domain.Interfaces;
using AutoMapper;
using FluentAssertions;
using Moq;

namespace App.Application.Tests.Services
{
    public class FarmReadTests
    {
        private readonly Mock<IFarmRepository> mockRepository = new();
        private readonly Mock<IMapper> mockMapper = new();

        [Fact]
        public async Task Get_FishFarm_Should_fetch_Fish_farm_when_found()
        {
            // Arrange
            var OrgId = Guid.NewGuid();
            var id = Guid.NewGuid();

            var fetchedFarm = new Farm
            {
                FarmId = id,
                Name = "Test Farm",
                Longitude = 55,
                Latitude = 86,
                NoOfCages = 5,
                HasBarge = false,
                OrgId = OrgId,
                Picture = "picture_url",
                Phone = "0112345678"
            };

            var expectedResponse = new FarmResponseDto
            {
                FarmId = fetchedFarm.FarmId,
                Name = fetchedFarm.Name,
                Longitude = fetchedFarm.Longitude,
                Latitude = fetchedFarm.Latitude,
                NoOfCages = fetchedFarm.NoOfCages,
                HasBarge = fetchedFarm.HasBarge,
                Picture = fetchedFarm.Picture,
                Phone = fetchedFarm.Phone
            };

            mockRepository.Setup(r => r.GetByIdAsync(id, OrgId)).ReturnsAsync(fetchedFarm);
            mockMapper.Setup(m => m.Map<FarmResponseDto>(fetchedFarm)).Returns(expectedResponse);

            var fService = new FarmService(mockRepository.Object, mockMapper.Object);

            //Act
            var result = await fService.GetFarmByIdAsync(id,OrgId);

            //Assert
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expectedResponse);

            mockRepository.Verify(
                r => r.GetByIdAsync(
                    It.Is<Guid>(fid => fid == id),
                    It.Is<Guid>(oid => oid == OrgId)
                ), Times.Once);

            mockMapper.Verify(m => m.Map<FarmResponseDto>(fetchedFarm), Times.Once);

        }


        [Fact]
        public async Task Get_FishFarm_Should_Throw_Exception_When_Farm_Is_Not_Found()
        {
            // Arrange
            var OrgId = Guid.NewGuid();
            var id = Guid.NewGuid();

            mockRepository.Setup(r => r.GetByIdAsync(id, OrgId)).ReturnsAsync((Farm?)null);

            var fService = new FarmService(mockRepository.Object, mockMapper.Object);

            //Act & Assert
            var act = async () => await fService.GetFarmByIdAsync(id,OrgId);
            await act.Should().ThrowAsync<KeyNotFoundException>().WithMessage($"Farm with ID {id} not found.");

            mockRepository.Verify(
                r => r.GetByIdAsync(id, OrgId), Times.Once
            );
            mockMapper.Verify(m => m.Map<FarmResponseDto>(It.IsAny<Farm>()), Times.Never);
        }

        [Fact]
        public async Task GetAll_FishFarm_Should_fetch_All_Fish_farms_For_Given_Org()
        {
            // Arrange
            var OrgId = Guid.NewGuid();

            var farm1 = new Farm
            {
                FarmId = Guid.NewGuid(),
                Name = "Test Farm1",
                Longitude = 55,
                Latitude = 86,
                NoOfCages = 5,
                HasBarge = false,
                OrgId = OrgId,
                Picture = "picture1_url",
                Phone = "0112345678"
            };

            var farm2 = new Farm
            {
                FarmId = Guid.NewGuid(),
                Name = "Test Farm2",
                Longitude = 5,
                Latitude = 36,
                NoOfCages = 8,
                HasBarge = true,
                OrgId = OrgId,
                Picture = null,
                Phone = "0112780078"
            };

            var farm3 = new Farm
            {
                FarmId = Guid.NewGuid(),
                Name = "Test Farm3",
                Longitude = 35,
                Latitude = 27.9032M,
                NoOfCages = 5,
                HasBarge = false,
                OrgId = OrgId,
                Picture = "picture2_url",
                Phone = null
            };

            var fetchedFarms = new[] { farm1, farm2, farm3 };

            var expectedResponse = new[] {
            new FarmResponseDto
            {
                FarmId = farm1.FarmId,
                Name = farm1.Name,
                Longitude = farm1.Longitude,
                Latitude = farm1.Latitude,
                NoOfCages = farm1.NoOfCages,
                HasBarge = farm1.HasBarge,
                Picture = farm1.Picture,
                Phone = farm1.Phone
            },
            new FarmResponseDto
            {
                FarmId = farm2.FarmId,
                Name = farm2.Name,
                Longitude = farm2.Longitude,
                Latitude = farm2.Latitude,
                NoOfCages = farm2.NoOfCages,
                HasBarge = farm2.HasBarge,
                Picture = farm2.Picture,
                Phone = farm2.Phone
            },
            new FarmResponseDto
            {
                FarmId = farm3.FarmId,
                Name = farm3.Name,
                Longitude = farm3.Longitude,
                Latitude = farm3.Latitude,
                NoOfCages = farm3.NoOfCages,
                HasBarge = farm3.HasBarge,
                Picture = farm3.Picture,
                Phone = farm3.Phone
            }
            };


            mockRepository.Setup(r => r.GetAllAsync(It.IsAny<Guid>())).ReturnsAsync(fetchedFarms);
            mockMapper.Setup(m => m.Map<IEnumerable<FarmResponseDto>>(It.IsAny<IEnumerable<Farm>>())).Returns(expectedResponse);

            var fService = new FarmService(mockRepository.Object, mockMapper.Object);

            //Act
            var result = await fService.GetAllFarmsAsync(OrgId);

            //Assert
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expectedResponse);

            mockRepository.Verify(
                r => r.GetAllAsync(
                    It.Is<Guid>(oid => oid == OrgId)
                ), Times.Once);

            mockMapper.Verify(m => m.Map<IEnumerable<FarmResponseDto>>(It.IsAny<IEnumerable<Farm>>()), Times.Once);

        }

    }
}