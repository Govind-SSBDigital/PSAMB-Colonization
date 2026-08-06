using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class updatedatatypeforplotno : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "PlotNo",
                table: "PropertyBidderRegistration",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
            migrationBuilder.CreateIndex(
                name: "IX_ApplicationUser_MobileNo",
                table: "ApplicationUser",
                column: "MobileNo",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BranchMandiAssociation");

            migrationBuilder.DropIndex(
                name: "IX_ApplicationUser_MobileNo",
                table: "ApplicationUser");

            migrationBuilder.AlterColumn<string>(
                name: "PlotNo",
                table: "PropertyBidderRegistration",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
