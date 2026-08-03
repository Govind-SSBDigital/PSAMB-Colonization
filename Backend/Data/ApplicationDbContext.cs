using Backend.Models.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace Backend.Data;

public class ApplicationDbContext : IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    //public DbSet<ApplicationUsers> ApplicationUsers { get; set; }
    public DbSet<BranchMaster> BranchMaster { get; set; }
    public DbSet<MandiMaster> MandiMaster { get; set; }
    public DbSet<PropertyBidderRegistration> PropertyBidderRegistration { get; set; }
    public DbSet<PlotSizeMaster> PlotSizeMaster { get; set; }
    public DbSet<PlotTypeMaster> PlotTypeMaster { get; set; }
    public DbSet<PlanMaster> PlanMaster { get; set; }
    public DbSet<PropertyType> PropertyType { get; set; }
    public DbSet<BidderTypeMaster> BidderTypeMaster { get; set; }
    public DbSet<ApplicationStatusMaster> ApplicationStatusMaster { get; set; }
    public DbSet<DistrictMaster> DistrictMaster { get; set; }
    public DbSet<StateMaster> StateMaster { get; set; }
    public DbSet<CityMaster> CityMaster { get; set; }
    public DbSet<InstallmentDetails> InstallmentDetails { get; set; }
    public DbSet<PropertyCategoryMaster> PropertyCategoryMaster { get; set; }



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

// =========================================================================
// DESIGN-TIME FACTORY (EF Core Migration tools ke liye)
// =========================================================================
public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        // Path to your web project where appsettings.json lives
        IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .Build();

        var builder = new DbContextOptionsBuilder<ApplicationDbContext>();
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        builder.UseSqlServer(connectionString);

        return new ApplicationDbContext(builder.Options);
    }
}