using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class addnewtableforuserregn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserPropertyRegistration",
                columns: table => new
                {
                    KnowyourPropertyAllotteeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AllotteeCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DistrictId = table.Column<int>(type: "int", nullable: true),
                    BranchId = table.Column<int>(type: "int", nullable: true),
                    PropertyType = table.Column<int>(type: "int", nullable: true),
                    MandiId = table.Column<int>(type: "int", nullable: true),
                    MandiCategoryId = table.Column<int>(type: "int", nullable: true),
                    PlotTypeId = table.Column<int>(type: "int", nullable: true),
                    PropertyCategory = table.Column<int>(type: "int", nullable: true),
                    PropertySubCategoryId = table.Column<int>(type: "int", nullable: true),
                    AssetSizeId = table.Column<int>(type: "int", nullable: true),
                    AssetID = table.Column<int>(type: "int", nullable: true),
                    AllotteeId = table.Column<int>(type: "int", nullable: true),
                    AllotteeName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AllotteeFatherName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AllotteeAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AllotteeMobileNo = table.Column<long>(type: "bigint", nullable: true),
                    AllotteeEmail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AllotteeStateId = table.Column<long>(type: "bigint", nullable: true),
                    AllotteeDistrictId = table.Column<long>(type: "bigint", nullable: true),
                    AllotteeCityId = table.Column<long>(type: "bigint", nullable: true),
                    Share = table.Column<int>(type: "int", nullable: true),
                    AllotteeIDProof = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IdProofDoc = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UploadAllotmentLetter = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NOC = table.Column<bool>(type: "bit", nullable: false),
                    UploadNoDuesCertificate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReceiptDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PaymentModeId = table.Column<int>(type: "int", nullable: true),
                    PaymentMode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PaymentChallanId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReceiptNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TotalPaidAmount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: true),
                    LevelId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: true),
                    CreatedBy = table.Column<long>(type: "bigint", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiedBy = table.Column<long>(type: "bigint", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Remarks = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReceiptDocument = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BForm = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConveyanceDeed = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SaleDeed = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TransferOrder = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    upload1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    upload2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AadharNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PassportNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PassportDocument = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PanNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PanDocument = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPropertyRegistration", x => x.KnowyourPropertyAllotteeId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserPropertyRegistration");
        }
    }
}
