using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class addinit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.CreateTable(
                name: "ApplicationStatusMaster",
                columns: table => new
                {
                    ApplicationStatusId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ApplicationStatusName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<long>(type: "bigint", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiedBy = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationStatusMaster", x => x.ApplicationStatusId);
                });

            migrationBuilder.CreateTable(
                name: "BidderTypeMaster",
                columns: table => new
                {
                    BidderTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BidderTypeName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<long>(type: "bigint", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiedBy = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BidderTypeMaster", x => x.BidderTypeId);
                });







            migrationBuilder.CreateTable(
                name: "PropertyBidderRegistration",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MandiId = table.Column<int>(type: "int", nullable: true),
                    BranchId = table.Column<int>(type: "int", nullable: false),
                    DistrictId = table.Column<int>(type: "int", nullable: false),
                    PlotTypeId = table.Column<int>(type: "int", nullable: true),
                    PlanId = table.Column<int>(type: "int", nullable: true),
                    PlotSize = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PlotNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AssetResumed = table.Column<bool>(type: "bit", nullable: false),
                    AssetSurrendered = table.Column<bool>(type: "bit", nullable: false),
                    IsAssetLocked = table.Column<bool>(type: "bit", nullable: false),
                    IsDefaulter = table.Column<bool>(type: "bit", nullable: false),
                    AnyComplaint = table.Column<bool>(type: "bit", nullable: false),
                    NdcGenerated = table.Column<bool>(type: "bit", nullable: false),
                    NdcIssued = table.Column<bool>(type: "bit", nullable: false),
                    AssetVerified = table.Column<bool>(type: "bit", nullable: false),
                    IsAuctioned = table.Column<bool>(type: "bit", nullable: false),
                    AuctionDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    BidderTypeId = table.Column<int>(type: "int", nullable: true),
                    BidderName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsTransferred = table.Column<bool>(type: "bit", nullable: false),
                    Relation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FatherOrHusbandName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PANNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AadhaarNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MobileNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PropertyTypeId = table.Column<int>(type: "int", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReservePrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    FinalBidPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    FormTransactionId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FormTxnDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FormPaidAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    EmdTxnId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmdDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EmdAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    AllotmentTxnId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AllotmentDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AllotmentAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    DueAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    TotalDueWithInterest = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    ReceiptNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReceiptDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DraftNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DraftAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    DraftDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DraftBank = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PrincipalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    InterestAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    OtherAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PenaltyAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PaymentType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Remarks = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<long>(type: "bigint", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiedBy = table.Column<long>(type: "bigint", nullable: true),
                    ApplicationStatusId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyBidderRegistration", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PropertyBidderRegistration_ApplicationStatusMaster_ApplicationStatusId",
                        column: x => x.ApplicationStatusId,
                        principalTable: "ApplicationStatusMaster",
                        principalColumn: "ApplicationStatusId");
                    table.ForeignKey(
                        name: "FK_PropertyBidderRegistration_BidderTypeMaster_BidderTypeId",
                        column: x => x.BidderTypeId,
                        principalTable: "BidderTypeMaster",
                        principalColumn: "BidderTypeId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_PropertyBidderRegistration_ApplicationStatusId",
                table: "PropertyBidderRegistration",
                column: "ApplicationStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyBidderRegistration_BidderTypeId",
                table: "PropertyBidderRegistration",
                column: "BidderTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyBidderRegistration_BranchId",
                table: "PropertyBidderRegistration",
                column: "BranchId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyBidderRegistration_DistrictId",
                table: "PropertyBidderRegistration",
                column: "DistrictId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyBidderRegistration_MandiId",
                table: "PropertyBidderRegistration",
                column: "MandiId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyBidderRegistration_PlanId",
                table: "PropertyBidderRegistration",
                column: "PlanId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyBidderRegistration_PlotTypeId",
                table: "PropertyBidderRegistration",
                column: "PlotTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyBidderRegistration_PropertyTypeId",
                table: "PropertyBidderRegistration",
                column: "PropertyTypeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CityMaster");

            migrationBuilder.DropTable(
                name: "PlotSizeMaster");

            migrationBuilder.DropTable(
                name: "PropertyBidderRegistration");

            migrationBuilder.DropTable(
                name: "StateMaster");

            migrationBuilder.DropTable(
                name: "ApplicationStatusMaster");

            migrationBuilder.DropTable(
                name: "BidderTypeMaster");

            migrationBuilder.DropTable(
                name: "BranchMaster");

            migrationBuilder.DropTable(
                name: "DistrictMaster");

            migrationBuilder.DropTable(
                name: "MandiMaster");

            migrationBuilder.DropTable(
                name: "PlanMaster");

            migrationBuilder.DropTable(
                name: "PlotTypeMaster");

            migrationBuilder.DropTable(
                name: "PropertyType");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LastName",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
