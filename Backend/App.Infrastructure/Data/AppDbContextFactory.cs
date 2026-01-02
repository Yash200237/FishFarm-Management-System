using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace App.Infrastructure.Data
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            optionsBuilder.UseSqlServer("Server=CL-YASHODAW\\SQLEXPRESS;Database=FarmAppDb;Trusted_Connection=true;MultipleActiveResultSets=true;TrustServerCertificate=True");
            return new AppDbContext(optionsBuilder.Options);
        }
    }
}
