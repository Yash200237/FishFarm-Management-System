using App.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace App.Infrastructure.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<Worker> Workers { get; set; }
        public DbSet<Farm> Farms { get; set; }
        public DbSet<FarmWorker> FarmWorkers { get; set; }
        public DbSet<Org> Organizations { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //Additional model configurations

            modelBuilder.Entity<Worker>(entity =>
            {
                entity.ToTable("Workers", t =>
                {
                    t.HasCheckConstraint("CK_Workers_Age_Positive", "[Age] > 0");
                });

                entity.HasKey(x => x.WorkerId);

                entity.Property(x => x.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(x => x.Email)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.HasIndex(x => x.Email)
                    .IsUnique();

                entity.Property(x => x.Phone)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(x => x.Picture)
                    .HasColumnType("nvarchar(max)");

                entity.Property(x => x.Age)
                    .IsRequired();

                entity.HasOne(x => x.Org)
                    .WithMany(o => o.Workers)
                    .HasForeignKey(x => x.OrgId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(x => x.OrgId);  // Performance
            });

            modelBuilder.Entity<Farm>(entity =>
            {
                entity.ToTable("Farms", t =>
                {
                    t.HasCheckConstraint("CK_Farms_NoOfCages_Positive", "[NoOfCages] > 0");
                    t.HasCheckConstraint("CK_Farms_Longitude_Range", "[Longitude] >= -180 AND [Longitude] <= 180");
                    t.HasCheckConstraint("CK_Farms_Latitude_Range", "[Latitude] >= -90 AND [Latitude] <= 90");
                });
                
                entity.HasKey(x => x.FarmId);
                
                entity.Property(x => x.Name)
                      .IsRequired()
                      .HasMaxLength(100);
                
                entity.Property(x => x.NoOfCages)
                    .IsRequired();

                entity.Property(x => x.Longitude)
                    .HasPrecision(9, 4);

                entity.Property(x => x.Latitude)
                    .HasPrecision(9, 4);
                
                entity.Property(x => x.HasBarge)
                    .IsRequired();

                entity.Property(x => x.Phone)
                    .HasMaxLength(20);

                entity.Property(x => x.Picture)
                    .HasColumnType("nvarchar(max)");

                entity.HasOne(x => x.Org)
                    .WithMany(o => o.Farms)
                    .HasForeignKey(x => x.OrgId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(x => x.OrgId);  // Performance
            });

            modelBuilder.Entity<FarmWorker>(entity =>
            {
                entity.ToTable("FarmWorkers", t =>
                {
                    t.HasCheckConstraint(
                        "CK_FarmWorkers_CertifiedUntil_FutureOrNull",
                        "[CertifiedUntil] IS NULL OR [CertifiedUntil] >= CONVERT(date, GETUTCDATE())"
                    );
                });

                entity.HasKey(x => new { x.FarmId, x.WorkerId });

                entity.HasOne(x => x.Farm)
                    .WithMany(f => f.FarmWorkers)
                    .HasForeignKey(x => x.FarmId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(x => x.Worker)
                    .WithMany(w => w.FarmWorkers)
                    .HasForeignKey(x => x.WorkerId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.Property(x => x.Role)
                    .IsRequired()
                    .HasConversion<string>()
                    .HasMaxLength(30);

                entity.Property(x => x.CertifiedUntil);
            });

            modelBuilder.Entity<Org>(entity =>
            {
                entity.ToTable("Organizations");

                entity.HasKey(x => x.OrgId);

                entity.Property(x => x.Name)
                    .IsRequired()
                    .HasMaxLength(100); 
                
                entity.Property(x => x.Description)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(x => x.Logo)
                    .HasColumnType("nvarchar(max)");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");

                entity.HasKey(x => x.UserId);

                entity.Property(x => x.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(x => x.Email)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.HasIndex(x => x.Email)
                    .IsUnique();

                entity.Property(x => x.UserName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasIndex(x => x.UserName)
                    .IsUnique();

                entity.Property(x => x.PasswordHash)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(x => x.UserRole)
                    .IsRequired()
                    .HasConversion<string>()
                    .HasMaxLength(30);

                entity.HasOne(x => x.Org)
                    .WithMany(o => o.Users)
                    .HasForeignKey(x => x.OrgId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(x => x.OrgId);
            });

        }


    }
}
