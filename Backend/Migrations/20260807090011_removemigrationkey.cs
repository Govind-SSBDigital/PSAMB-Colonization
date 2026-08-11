using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class removemigrationkey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PropertyBidderRegistration_ApplicationStatusMaster_ApplicationStatusId",
                table: "PropertyBidderRegistration");

            migrationBuilder.DropIndex(
                name: "IX_PropertyBidderRegistration_ApplicationStatusId",
                table: "PropertyBidderRegistration");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_PropertyBidderRegistration_ApplicationStatusId",
                table: "PropertyBidderRegistration",
                column: "ApplicationStatusId");

            migrationBuilder.AddForeignKey(
                name: "FK_PropertyBidderRegistration_ApplicationStatusMaster_ApplicationStatusId",
                table: "PropertyBidderRegistration",
                column: "ApplicationStatusId",
                principalTable: "ApplicationStatusMaster",
                principalColumn: "ApplicationStatusId");
        }
    }
}
