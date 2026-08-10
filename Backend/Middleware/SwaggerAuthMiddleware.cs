using System.Text;

namespace Backend.Middleware
{
    public class SwaggerAuthMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;

        public SwaggerAuthMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _configuration = configuration;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.Request.Path.StartsWithSegments("/swagger"))
            {
                string? authHeader = context.Request.Headers["Authorization"];

                if (authHeader != null && authHeader.StartsWith("Basic "))
                {
                    var encodedCredentials = authHeader.Substring("Basic ".Length).Trim();
                    var decodedBytes = Convert.FromBase64String(encodedCredentials);
                    var decodedCredentials = Encoding.UTF8.GetString(decodedBytes);
                    var parts = decodedCredentials.Split(':', 2);

                    var configUser = _configuration["SwaggerAuth:Username"];
                    var configPass = _configuration["SwaggerAuth:Password"];

                    if (parts.Length == 2 && parts[0] == configUser && parts[1] == configPass)
                    {
                        await _next(context);
                        return;
                    }
                }

                context.Response.Headers["WWW-Authenticate"] = "Basic";
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("Unauthorized to access Swagger.");
                return;
            }

            await _next(context);
        }
    }
}
