using Microsoft.Extensions.DependencyInjection;

namespace App.Domain
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddDomainDI(this IServiceCollection services)
            {
                return services;
            }
    }
}
