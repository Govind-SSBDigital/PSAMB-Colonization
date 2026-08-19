using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class RemoveHRMSDataFromMigrations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OwnerCityID",
                table: "PropertyBidderRegistration",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OwnerDistrtictID",
                table: "PropertyBidderRegistration",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OwnerStateID",
                table: "PropertyBidderRegistration",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OwnerCityID",
                table: "PropertyBidderRegistration");

            migrationBuilder.DropColumn(
                name: "OwnerDistrtictID",
                table: "PropertyBidderRegistration");

            migrationBuilder.DropColumn(
                name: "OwnerStateID",
                table: "PropertyBidderRegistration");
        }
    }
}
