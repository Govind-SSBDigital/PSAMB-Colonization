using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddHRMSDataMapping : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.CreateTable(
            //    name: "HRMSData",
            //    columns: table => new
            //    {
            //        HRMSCODE = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
            //        EmployeeName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
            //        MobileNo = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true),
            //        DesignationId = table.Column<int>(type: "int", nullable: true),
            //        Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_HRMSData", x => x.HRMSCODE);
            //    });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropTable(
            //    name: "HRMSData");
        }
    }
}
