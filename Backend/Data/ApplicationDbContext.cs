using Backend.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class ApplicationDbContext : IdentityDbContext<IdentityApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

<<<<<<< HEAD

    public DbSet<ApplicationUser> ApplicationUsers => Set<ApplicationUser>();
    public DbSet<ApplicantAuth> ApplicantAuths => Set<ApplicantAuth>();
    public DbSet<MobileOTPs> MobileOTPs { get; set; }
    public DbSet<StateMaster> StateMasters { get; set; }
    public DbSet<DistrictMaster> DistrictMasters { get; set; }
    public DbSet<CityMaster> CityMasters { get; set; }
    public DbSet<EmailOtp> EmailOtps { get; set; }
=======
    public DbSet<ApplicationUsers> ApplicationUsers { get; set; }

>>>>>>> 2ecc0f677ecb2ec440065cbcc7bb3771dba5051e
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<StateMaster>()
         .ToTable("StateMaster", t => t.ExcludeFromMigrations())
         .HasKey(x => x.StateId);

        builder.Entity<DistrictMaster>()
            .ToTable("DistrictMaster", t => t.ExcludeFromMigrations())
            .HasKey(x => x.DistrictId);

        builder.Entity<CityMaster>()
            .ToTable("CityMaster", t => t.ExcludeFromMigrations())
            .HasKey(x => x.CityId);
        builder.Entity<EmailOtp>()
    .ToTable("EmailOTP", t => t.ExcludeFromMigrations())
    .HasKey(x => x.OTPId);
        // ── ApplicationUser ───────────────────────────
        builder.Entity<ApplicationUser>(b =>
        {
            b.ToTable("ApplicationUser");

            b.HasKey(x => x.ApplicantId);

            b.Property(x => x.ApplicantId)
             .UseIdentityColumn(100, 1);
            b.Property(x => x.IdentityUserId).HasMaxLength(450);
            b.HasIndex(x => x.IdentityUserId).IsUnique();
            b.Property(x => x.FirstName).HasMaxLength(200).IsRequired();
            b.Property(x => x.LastName).HasMaxLength(100);
            b.Property(x => x.Email).HasMaxLength(255).IsRequired();
            b.Property(x => x.MobileNo).HasMaxLength(15).IsRequired();
            b.Property(x => x.PANNumber).HasMaxLength(10);
            b.Property(x => x.GSTNumber).HasMaxLength(20);
            b.Property(x => x.IndividualPinCode).HasMaxLength(10);
            b.Property(x => x.BusinessPinCode).HasMaxLength(10);
            b.Property(x => x.FirmName).HasMaxLength(250);
            b.Property(x => x.MandiPropertyCode).HasMaxLength(100);
            b.Property(x => x.IdentDocNumber).HasMaxLength(100);
            b.Property(x => x.AddrDocNumber).HasMaxLength(100);
            b.Property(x => x.PhotoPath).HasMaxLength(500);
            b.Property(x => x.IdentDocPath).HasMaxLength(500);
            b.Property(x => x.PANDocPath).HasMaxLength(500);
            b.Property(x => x.AddrDocPath).HasMaxLength(500);
            b.Property(x => x.OfficePropertyPhotoPath).HasMaxLength(500);
            b.Property(x => x.IndividualPlotStreetLandmark).HasMaxLength(500);
            b.Property(x => x.BusinessPlotStreetLandmark).HasMaxLength(500);

            b.HasIndex(x => x.Email).IsUnique();
            b.HasIndex(x => x.MobileNo).IsUnique();

            // Soft delete filter
            //b.HasQueryFilter(x => !x.IsDeleted);
        });

        // ── ApplicantAuth ─────────────────────────────
        builder.Entity<ApplicantAuth>(b =>
        {
            b.ToTable("ApplicantAuth");

            b.HasKey(x => x.AuthId);

            b.Property(x => x.AuthId)
             .UseIdentityColumn(1, 1);

            b.Property(x => x.Username).HasMaxLength(255).IsRequired();
            b.Property(x => x.PasswordHash).HasMaxLength(500).IsRequired();
            b.Property(x => x.SaltKey).HasMaxLength(255).IsRequired();
            b.Property(x => x.LastLoginIP).HasMaxLength(50);

            b.HasIndex(x => x.Username).IsUnique();
            b.HasIndex(x => x.ApplicantId).IsUnique(); // one-to-one

            //b.HasQueryFilter(x => !x.IsDeleted);
        });

        // ── MobileOTPs ────────────────────────────────
        builder.Entity<MobileOTPs>(b =>
        {
            b.ToTable("MobileOTP");

            b.HasKey(x => x.OTPId);

            b.Property(x => x.OTPId)
             .UseIdentityColumn(1, 1);

            b.Property(x => x.MobileNumber).HasMaxLength(15).IsRequired();
            b.Property(x => x.OTP).HasMaxLength(10).IsRequired();
        });
    }

    // ── TDE Verify ───────────────────────────────────
    public async Task VerifyTdeAsync()
    {
        try
        {
            var isEncrypted = false;
            var connection = Database.GetDbConnection();
            var wasOpen = connection.State == System.Data.ConnectionState.Open;

            if (!wasOpen)
                await Database.OpenConnectionAsync();

            using (var command = connection.CreateCommand())
            {
                command.CommandText =
                    "SELECT is_encrypted FROM sys.databases WHERE name = DB_NAME()";
                var result = await command.ExecuteScalarAsync();
                if (result != null && result != DBNull.Value)
                    isEncrypted = Convert.ToInt32(result) == 1;
            }

            if (!wasOpen)
                await Database.CloseConnectionAsync();

            if (!isEncrypted)
                throw new InvalidOperationException(
                    "CRITICAL: TDE is NOT enabled on the target database.");
        }
        catch (Exception ex) when (ex is not InvalidOperationException)
        {
            throw new InvalidOperationException("TDE verification failed.", ex);
        }
    }
}