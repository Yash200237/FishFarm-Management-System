using App.Application.DTOs;
using App.Application.Services;
using App.Domain.Entities;
using App.Domain.Interfaces;
using AutoMapper;
using FluentAssertions;
using Moq;

namespace App.Application.Tests.Services
{
    public class FarmDeleteTests
    {
        private readonly Mock<IFarmRepository> mockRepository = new();
        private readonly Mock<IMapper> mockMapper = new();

        [Fact]
        public async Task Delete_FishFarm_Should_delete_Fish_farm_when_found()
        {
            // Arrange
            var OrgId = Guid.NewGuid();
            var id = Guid.NewGuid(); 

            mockRepository.Setup(r => r.DeleteAsync(id, OrgId)).ReturnsAsync(true);

            var fService = new FarmService(mockRepository.Object, mockMapper.Object);

            //Act
            await fService.DeleteFarmAsync(id,OrgId);

            //Assert
            mockRepository.Verify(
                r => r.DeleteAsync(
                    It.Is<Guid>(fid => fid == id),
                    It.Is<Guid>(oid => oid == OrgId)
                ), Times.Once);

        }


        [Fact]
        public async Task Delete_FishFarm_Should_Throw_Exception_When_Farm_Is_Not_Found()
        {
            // Arrange
            var OrgId = Guid.NewGuid();
            var id = Guid.NewGuid();

            mockRepository.Setup(r => r.DeleteAsync(id, OrgId)).ReturnsAsync(false);

            var fService = new FarmService(mockRepository.Object, mockMapper.Object);

            //Act & Assert
            var act = async () => await fService.DeleteFarmAsync(id,OrgId);
            await act.Should().ThrowAsync<KeyNotFoundException>().WithMessage($"Farm with ID {id} not found.");

            mockRepository.Verify(
                r => r.DeleteAsync(id, OrgId), Times.Once
            );
        }

        
    }
}