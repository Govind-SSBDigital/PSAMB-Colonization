using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class addnewcolumnforuserregn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "AllotteeStateId",
                table: "UserPropertyRegistration",
                type: "int",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AllotteeMobileNo",
                table: "UserPropertyRegistration",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "AllotteeDistrictId",
                table: "UserPropertyRegistration",
                type: "int",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "AllotteeCityId",
                table: "UserPropertyRegistration",
                type: "int",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PlotNo",
                table: "UserPropertyRegistration",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlotSize",
                table: "UserPropertyRegistration",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PlotNo",
                table: "UserPropertyRegistration");

            migrationBuilder.DropColumn(
                name: "PlotSize",
                table: "UserPropertyRegistration");

            migrationBuilder.AlterColumn<long>(
                name: "AllotteeStateId",
                table: "UserPropertyRegistration",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<long>(
                name: "AllotteeMobileNo",
                table: "UserPropertyRegistration",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<long>(
                name: "AllotteeDistrictId",
                table: "UserPropertyRegistration",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<long>(
                name: "AllotteeCityId",
                table: "UserPropertyRegistration",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
