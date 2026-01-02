using App.Application;
using App.Domain.Enums;
using App.Infrastructure;

namespace FishFarmApp
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddAppDI(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddApplicationDI()
                    .AddInfrastructureDI(configuration);

            services.AddAuthorization(options =>
            {
                options.AddPolicy("RequireGlobalAdmin", policy =>
                    policy.RequireRole(UserRoles.GlobalAdmin.ToString()));
                // Only organisation administrators can perform admin‑level actions
                options.AddPolicy("RequireOrgAdmin", policy =>
                {
                    policy.RequireClaim("OrgId");
                    policy.RequireRole(UserRoles.OrgAdmin.ToString());
                });
                // Any member of an organisation (either admin or user) must have an OrgId claim
                options.AddPolicy("RequireOrgMember", policy =>
                {
                    policy.RequireClaim("OrgId");
                    policy.RequireRole(UserRoles.OrgAdmin.ToString(),
                                       UserRoles.OrgUser.ToString());
                });
            });
            return services;
        }
    }
}
