using App.Application.Interfaces;
using App.Domain.Interfaces;
using App.Infrastructure.Data;
using App.Infrastructure.Repositories;
using App.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace App.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureDI(this IServiceCollection services,IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            });
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
             {
                 options.TokenValidationParameters = new TokenValidationParameters   // after validatin token HttpContext.User is set //identity object is created
                 {
                     ValidateIssuer = true,
                     ValidateAudience = true,
                     ValidateIssuerSigningKey = true,
                     ValidateLifetime = true,

                     ValidIssuer = configuration["Jwt:Issuer"],
                     ValidAudience = configuration["Jwt:Audience"],
                     IssuerSigningKey = new SymmetricSecurityKey(
                         Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!)
                     )
                 };
             });
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IFarmRepository, FarmRepository>();   //register repository with scoped lifetime
            services.AddScoped<IWorkerRepository, WorkerRepository>();   //register repository with scoped lifetime
            services.AddScoped<IFarmWorkerRepository, FarmWorkerRepository>();   //register repository with scoped lifetime
            services.AddScoped<IOrgRepository, OrgRepository>();   //register repository with scoped lifetime
            services.AddScoped<ITokenservice, JwtTokenService>();

            return services;
            }
    }
}
