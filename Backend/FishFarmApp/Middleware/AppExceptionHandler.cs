using FishFarmApp.Controllers;
using Microsoft.AspNetCore.Diagnostics;

namespace FishFarmApp.Middleware
{
    public class AppExceptionHandler(ILogger<AppExceptionHandler> logger) : IExceptionHandler
    {
        private readonly ILogger<AppExceptionHandler> _logger = logger;

        public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
        {
            var (statusCode, message, logLevel) = exception switch
            {
                ArgumentException ex => (StatusCodes.Status400BadRequest, ex.Message, LogLevel.Information),
                KeyNotFoundException ex => (StatusCodes.Status404NotFound, ex.Message, LogLevel.Information),
                UnauthorizedAccessException ex => (StatusCodes.Status401Unauthorized, ex.Message, LogLevel.Information),
                _ => (StatusCodes.Status500InternalServerError, "Internal server error", LogLevel.Error)
            };

            _logger.Log(logLevel, exception, "Request failed with status code {StatusCode}", statusCode);
            httpContext.Response.StatusCode = statusCode;
            httpContext.Response.ContentType = "application/json";

            await httpContext.Response.WriteAsJsonAsync(new { message }, cancellationToken);

            return true;
        }
    }
}