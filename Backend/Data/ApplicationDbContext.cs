using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<ApplicationUsers> ApplicationUsers { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Custom model configurations can be added here
    }

    public async Task VerifyTdeAsync()
    {
        try
        {
            var isEncrypted = false;
            var connection = Database.GetDbConnection();
            var wasOpen = connection.State == System.Data.ConnectionState.Open;
            
            if (!wasOpen)
            {
                await Database.OpenConnectionAsync();
            }

            using (var command = connection.CreateCommand())
            {
                command.CommandText = "SELECT is_encrypted FROM sys.databases WHERE name = DB_NAME()";
                var result = await command.ExecuteScalarAsync();
                if (result != null && result != DBNull.Value)
                {
                    isEncrypted = Convert.ToInt32(result) == 1;
                }
            }

            if (!wasOpen)
            {
                await Database.CloseConnectionAsync();
            }

            if (!isEncrypted)
            {
                throw new InvalidOperationException("CRITICAL CONFIGURATION ERROR: Transparent Data Encryption (TDE) is NOT enabled on the target database.");
            }
        }
        catch (Exception ex) when (!(ex is InvalidOperationException))
        {
            // If sys.databases is inaccessible (e.g. on limited cloud databases or LocalDB), we log but don't crash
            // in development. In production, we should handle this strictly.
            throw new InvalidOperationException("TDE verification check failed to execute.", ex);
        }
    }
}
