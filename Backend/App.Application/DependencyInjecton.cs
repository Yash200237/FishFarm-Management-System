using App.Application.Interfaces;
using App.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace App.Application
{
    public static class DependencyInjecton
    {
        public static IServiceCollection AddApplicationDI(this IServiceCollection services)
        {
            services.AddScoped<IFarmService, FarmService>();   //register service with scoped lifetime
            services.AddScoped<IWorkerService, WorkerService>();   //register service with scoped lifetime
            services.AddScoped<IFarmWorkerService, FarmWorkerService>();   //register service with scoped lifetime
            services.AddScoped<IOrgService, OrgService>();   //register service with scoped lifetime
            services.AddScoped<IUserService, UserService>();

            return services;
        }
    }
}
