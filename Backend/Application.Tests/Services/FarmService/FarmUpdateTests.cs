using App.Application.DTOs;
using App.Application.Services;
using App.Domain.Entities;
using App.Domain.Interfaces;
using AutoMapper;
using FluentAssertions;
using Moq;

namespace App.Application.Tests.Services
{
    public class FarmUpdateTests
    {
        private readonly Mock<IFarmRepository> mockRepository = new();
        private readonly Mock<IMapper> mockMapper = new();

        [Fact]
        public async Task Update_FishFarm_Should_Save_Update_And_Return_Dto()
        {
            // Arrange
            var OrgId = Guid.NewGuid();
            var id = Guid.NewGuid();
            var updateFarmDto = new UpdateFarmDto
            {
                Name = "New Farm Name",
                Longitude = 8,
                Latitude = 45.0m,
                NoOfCages = 10,
                HasBarge = true,
                Phone = null,
                Picture = "img_url"
            };
            var existingFarm = new Farm
            {
                FarmId = id,
                Name = "Old Farm Name",
                Longitude = 5,
                Latitude = 40.0m,
                NoOfCages = 5,
                HasBarge = false,
                OrgId = OrgId,
                Phone = null,
                Picture = "img_url"
            };
            var expectedResponse = new FarmResponseDto
            {
                FarmId = id,
                Name = updateFarmDto.Name.Trim(),
                Longitude = updateFarmDto.Longitude,
                Latitude = updateFarmDto.Latitude,
                NoOfCages = updateFarmDto.NoOfCages,
                HasBarge = updateFarmDto.HasBarge,
                Picture = updateFarmDto.Picture,
                Phone = updateFarmDto.Phone
            };
            mockRepository.Setup(r => r.GetByIdAsync(id, OrgId)).ReturnsAsync(existingFarm);
            mockRepository.Setup(r => r.UpdateAsync(It.IsAny<Farm>())).Returns(Task.CompletedTask);
            mockMapper.Setup(m => m.Map<FarmResponseDto>(It.IsAny<Farm>())).Returns(expectedResponse);

            var fService = new FarmService (mockRepository.Object, mockMapper.Object);

            //Act
            var result = await fService.UpdateFarmAsync(id, updateFarmDto, OrgId);

            //Assert
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expectedResponse);

            mockRepository.Verify(
                r => r.UpdateAsync(It.Is<Farm>(f =>
                    f.OrgId == OrgId &&
                    f.FarmId == id &&
                    f.Name == updateFarmDto.Name.Trim() &&
                    f.Longitude == updateFarmDto.Longitude &&
                    f.Latitude == updateFarmDto.Latitude &&
                    f.NoOfCages == updateFarmDto.NoOfCages &&
                    f.HasBarge == updateFarmDto.HasBarge &&
                    f.Phone == updateFarmDto.Phone &&
                    f.Picture == updateFarmDto.Picture
            )), Times.Once);

            mockRepository.Verify(r => r.GetByIdAsync(id, OrgId), Times.Once);
            mockMapper.Verify(m => m.Map<FarmResponseDto>(It.IsAny<Farm>()), Times.Once);

        }


        [Fact]
        public async Task Update_FishFarm_Should_Throw_Exception_When_Request_Is_Null()
        {
            // Arrange
            var OrgId = Guid.NewGuid();
            var id = Guid.NewGuid();

            var fService = new FarmService(mockRepository.Object, mockMapper.Object);

            //Act & Assert
            var act = async () => await fService.UpdateFarmAsync(id, null!, OrgId);
            await act.Should().ThrowAsync<ArgumentNullException>().Where(e => e.ParamName == "updateFarmDto");
            mockRepository.Verify(
                r => r.UpdateAsync(It.IsAny<Farm>()), Times.Never
            );
            mockRepository.Verify(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<Guid>()), Times.Never);
            mockMapper.Verify(m => m.Map<FarmResponseDto>(It.IsAny<Farm>()), Times.Never);


        }

        [Fact]
        public async Task Update_FishFarm_Should_Throw_Exception_When_Farm_Is_NotFound()
        {
            // Arrange
            var OrgId = Guid.NewGuid();
            var id = Guid.NewGuid();
            var updateFarmDto = new UpdateFarmDto
            {
                Name = "New Farm Name",
                Longitude = 80,
                Latitude = 45.0m,
                NoOfCages = 10,
                HasBarge = true,
                Phone = null,
                Picture = "img_url"
            };

            mockRepository.Setup(r => r.GetByIdAsync(id, OrgId)).ReturnsAsync((Farm?)null);

            var fService = new FarmService(mockRepository.Object, mockMapper.Object);

            //Act & Assert
            var act = async () => await fService.UpdateFarmAsync(id, updateFarmDto, OrgId);
            await act.Should().ThrowAsync<KeyNotFoundException>().WithMessage($"Farm with ID {id} not found.");
            mockRepository.Verify(r => r.GetByIdAsync(id, OrgId), Times.Once);
            mockRepository.Verify(
                r => r.UpdateAsync(It.IsAny<Farm>()), Times.Never
            );
            mockMapper.Verify(m => m.Map<FarmResponseDto>(It.IsAny<Farm>()), Times.Never);


        }


        [Fact]
        public async Task Update_FishFarm_Should_Throw_Exception_When_Longitude_Is_OutOfRange()
        {
            // Arrange
            var OrgId = Guid.NewGuid();
            var id = Guid.NewGuid();
            var updateFarmDto = new UpdateFarmDto
            {
                Name = "New Farm Name",
                Longitude = 800,
                Latitude = 45.0m,
                NoOfCages = 10,
                HasBarge = true,
                Phone = null,
                Picture = "img_url"
            };
            var existingFarm = new Farm
            {
                FarmId = id,
                Name = "Old Farm Name",
                Longitude = 5,
                Latitude = 40.0m,
                NoOfCages = 5,
                HasBarge = false,
                OrgId = OrgId,
                Phone = null,
                Picture = "img_url"
            };

            mockRepository.Setup(r => r.GetByIdAsync(id, OrgId)).ReturnsAsync(existingFarm);


            var fService = new FarmService(mockRepository.Object, mockMapper.Object);

            //Act & Assert
            var act = async () => await fService.UpdateFarmAsync(id, updateFarmDto, OrgId);
            await act.Should().ThrowAsync<ArgumentException>().WithMessage("Longitude must be between -180 and 180.");
            mockRepository.Verify(
                r => r.UpdateAsync(It.IsAny<Farm>()), Times.Never
            );
            mockRepository.Verify(r => r.GetByIdAsync(id, OrgId), Times.Once);
            mockMapper.Verify(m => m.Map<FarmResponseDto>(It.IsAny<Farm>()), Times.Never);

        }

        [Fact]
        public async Task Update_FishFarm_Should_Throw_Exception_When_Latitude_Is_OutOfRange()
        {
            // Arrange
            var OrgId = Guid.NewGuid();
            var id = Guid.NewGuid();
            var updateFarmDto = new UpdateFarmDto
            {
                Name = "New Farm Name",
                Longitude = 80,
                Latitude = 450.0m,
                NoOfCages = 10,
                HasBarge = true,
                Phone = null,
                Picture = "img_url"
            };
            var existingFarm = new Farm
            {
                FarmId = id,
                Name = "Old Farm Name",
                Longitude = 5,
                Latitude = 40.0m,
                NoOfCages = 5,
                HasBarge = false,
                OrgId = OrgId,
                Phone = null,
                Picture = "img_url"
            };

            mockRepository.Setup(r => r.GetByIdAsync(id, OrgId)).ReturnsAsync(existingFarm);


            var fService = new FarmService(mockRepository.Object, mockMapper.Object);

            //Act & Assert
            var act = async () => await fService.UpdateFarmAsync(id, updateFarmDto, OrgId);
            await act.Should().ThrowAsync<ArgumentException>().WithMessage("Latitude must be between -90 and 90.");
            mockRepository.Verify(
                r => r.UpdateAsync(It.IsAny<Farm>()), Times.Never
            );
            mockRepository.Verify(r => r.GetByIdAsync(id, OrgId), Times.Once);
            mockMapper.Verify(m => m.Map<FarmResponseDto>(It.IsAny<Farm>()), Times.Never);

        }

        [Fact]
        public async Task Update_FishFarm_Should_Throw_Exception_When_FarmName_Is_NotGiven()
        {
            // Arrange
            var OrgId = Guid.NewGuid();
            var id = Guid.NewGuid();
            var updateFarmDto = new UpdateFarmDto
            {
                Name = "  ",
                Longitude = 80,
                Latitude = 45.0m,
                NoOfCages = 10,
                HasBarge = true,
                Phone = null,
                Picture = "img_url"
            };
            var existingFarm = new Farm
            {
                FarmId = id,
                Name = "Old Farm Name",
                Longitude = 5,
                Latitude = 40.0m,
                NoOfCages = 5,
                HasBarge = false,
                OrgId = OrgId,
                Phone = null,
                Picture = "img_url"
            };

            mockRepository.Setup(r => r.GetByIdAsync(id, OrgId)).ReturnsAsync(existingFarm);

            var fService = new FarmService(mockRepository.Object, mockMapper.Object);

            //Act & Assert
            var act = async () => await fService.UpdateFarmAsync(id, updateFarmDto, OrgId);
            await act.Should().ThrowAsync<ArgumentException>().WithMessage("Farm name cannot be empty.");
            mockRepository.Verify(
                r => r.UpdateAsync(It.IsAny<Farm>()), Times.Never
            );
            mockRepository.Verify(r => r.GetByIdAsync(id, OrgId), Times.Once);
            mockMapper.Verify(m => m.Map<FarmResponseDto>(It.IsAny<Farm>()), Times.Never);

        }

        [Fact]
        public async Task Update_FishFarm_Should_Throw_Exception_When_FarmName_Is_Loo_Long()
        {
            // Arrange
            var OrgId = Guid.NewGuid();
            var id = Guid.NewGuid();
            var updateFarmDto = new UpdateFarmDto
            {
                Name = new string('a', 101),
                Longitude = 80,
                Latitude = 45.0m,
                NoOfCages = 10,
                HasBarge = true,
                Phone = null,
                Picture = "img_url"
            };
            var existingFarm = new Farm
            {
                FarmId = id,
                Name = "Old Farm Name",
                Longitude = 5,
                Latitude = 40.0m,
                NoOfCages = 5,
                HasBarge = false,
                OrgId = OrgId,
                Phone = null,
                Picture = "img_url"
            };

            mockRepository.Setup(r => r.GetByIdAsync(id, OrgId)).ReturnsAsync(existingFarm);

            var fService = new FarmService(mockRepository.Object, mockMapper.Object);

            //Act & Assert
            var act = async () => await fService.UpdateFarmAsync(id, updateFarmDto, OrgId);
            await act.Should().ThrowAsync<ArgumentException>().WithMessage("Farm name cannot exceed 100 characters.");
            mockRepository.Verify(
                r => r.UpdateAsync(It.IsAny<Farm>()), Times.Never
            );
            mockRepository.Verify(r => r.GetByIdAsync(id, OrgId), Times.Once);
            mockMapper.Verify(m => m.Map<FarmResponseDto>(It.IsAny<Farm>()), Times.Never);

        }

        [Fact]
        public async Task Update_FishFarm_Should_Throw_Exception_When_NoOfCages_Is_Zero()
        {
            // Arrange
            var OrgId = Guid.NewGuid();
            var id = Guid.NewGuid();
            var updateFarmDto = new UpdateFarmDto
            {
                Name = "New Farm Name",
                Longitude = 80,
                Latitude = 45.0m,
                NoOfCages = 0,
                HasBarge = true,
                Phone = null,
                Picture = "img_url"
            };
            var existingFarm = new Farm
            {
                FarmId = id,
                Name = "Old Farm Name",
                Longitude = 5,
                Latitude = 40.0m,
                NoOfCages = 5,
                HasBarge = false,
                OrgId = OrgId,
                Phone = null,
                Picture = "img_url"
            };

            mockRepository.Setup(r => r.GetByIdAsync(id, OrgId)).ReturnsAsync(existingFarm);

            var fService = new FarmService(mockRepository.Object, mockMapper.Object);

            //Act & Assert
            var act = async () => await fService.UpdateFarmAsync(id, updateFarmDto, OrgId);
            await act.Should().ThrowAsync<ArgumentException>().WithMessage("Number of cages must be greater than 0.");
            mockRepository.Verify(
                r => r.UpdateAsync(It.IsAny<Farm>()), Times.Never
            );
            mockRepository.Verify(r => r.GetByIdAsync(id, OrgId), Times.Once);
            mockMapper.Verify(m => m.Map<FarmResponseDto>(It.IsAny<Farm>()), Times.Never);

        }
    }
}