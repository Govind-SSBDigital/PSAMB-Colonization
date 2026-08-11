using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddNewEntities : Migration
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
                name: "BranchMaster",
                columns: table => new
                {
                    BranchId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AgencyId = table.Column<int>(type: "int", nullable: false),
                    BranchName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BranchParentId = table.Column<int>(type: "int", nullable: true),
                    ZMEOId = table.Column<int>(type: "int", nullable: true),
                    DmeoId = table.Column<int>(type: "int", nullable: true),
                    ZAId = table.Column<int>(type: "int", nullable: true),
                    BranchTypeId = table.Column<int>(type: "int", nullable: true),
                    BranchCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BranchLogo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CityId = table.Column<int>(type: "int", nullable: true),
                    EmailId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MobileNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LandlineNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PinCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PanNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BankLedgerId = table.Column<int>(type: "int", nullable: true),
                    BankLedgerAccountNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BankLedgerIFSCCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TinNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CollectionBankName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CollectionBankAccountNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CollectionBankIFSCCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsUser = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<long>(type: "bigint", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiedBy = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    BBYZoneId = table.Column<int>(type: "int", nullable: true),
                    Branch_UUId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DistrictId = table.Column<int>(type: "int", nullable: true),
                    BranchPunjabiName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    P_BranchId = table.Column<int>(type: "int", nullable: true),
                    RoleId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BranchMaster", x => x.BranchId);
                });

            migrationBuilder.CreateTable(
                name: "InstallmentDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReceiptNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReceiptDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DraftNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DraftAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    DraftDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DraftBank = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Principal = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Interest = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    OtherAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    PenaltyAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Remarks = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApplicantId = table.Column<int>(type: "int", nullable: false),
                    PropertyId = table.Column<int>(type: "int", nullable: true),
                    IsVerified = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InstallmentDetails", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MandiMaster",
                columns: table => new
                {
                    MandiId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DistrictId = table.Column<int>(type: "int", nullable: false),
                    MandiName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MandiCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<long>(type: "bigint", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiedBy = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    MandiCategoryId = table.Column<int>(type: "int", nullable: false),
                    PrincipalYardId = table.Column<int>(type: "int", nullable: true),
                    MandiTypeId = table.Column<int>(type: "int", nullable: true),
                    DailyProduction = table.Column<float>(type: "real", nullable: true),
                    IsPPM = table.Column<bool>(type: "bit", nullable: true),
                    MandiPunjabiName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    P_MandiId = table.Column<int>(type: "int", nullable: true),
                    IsClosed = table.Column<bool>(type: "bit", nullable: true),
                    MandiClosedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MandiMaster", x => x.MandiId);
                });

            migrationBuilder.CreateTable(
                name: "PlanMaster",
                columns: table => new
                {
                    PlanId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlanName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PlanSanctionDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PlanMap = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    Remarks = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: true),
                    CreatedBy = table.Column<long>(type: "bigint", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiedBy = table.Column<long>(type: "bigint", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsColonized = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlanMaster", x => x.PlanId);
                });

            migrationBuilder.CreateTable(
                name: "PlotSizeMaster",
                columns: table => new
                {
                    PlotSizeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlotSize = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<long>(type: "bigint", nullable: true),
                    ModifiedBy = table.Column<long>(type: "bigint", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsColonized = table.Column<bool>(type: "bit", nullable: true),
                    CoveredArea = table.Column<double>(type: "float", nullable: true),
                    Basement = table.Column<double>(type: "float", nullable: true),
                    FirstFloor = table.Column<double>(type: "float", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlotSizeMaster", x => x.PlotSizeId);
                });

            migrationBuilder.CreateTable(
                name: "PlotTypeMaster",
                columns: table => new
                {
                    PlotTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlotType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PropertyTypeId = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: true),
                    CreatedBy = table.Column<long>(type: "bigint", nullable: true),
                    ModifiedBy = table.Column<long>(type: "bigint", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlotTypeMaster", x => x.PlotTypeId);
                });

            migrationBuilder.CreateTable(
                name: "PropertyCategoryMaster",
                columns: table => new
                {
                    PropertyCategoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<long>(type: "bigint", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiedBy = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyCategoryMaster", x => x.PropertyCategoryId);
                });

            migrationBuilder.CreateTable(
                name: "PropertyType",
                columns: table => new
                {
                    PropertyTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PropertyTypeName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<long>(type: "bigint", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiedBy = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyType", x => x.PropertyTypeId);
                });

            migrationBuilder.CreateTable(
                name: "PropertyBidderRegistration",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MandiId = table.Column<int>(type: "int", nullable: false),
                    BranchId = table.Column<int>(type: "int", nullable: false),
                    DistrictId = table.Column<int>(type: "int", nullable: false),
                    PlotTypeId = table.Column<int>(type: "int", nullable: true),
                    PlanId = table.Column<int>(type: "int", nullable: true),
                    ApplicantId = table.Column<int>(type: "int", nullable: false),
                    PlotSize = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
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
                    ReservePrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    FinalBidPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    FormTransactionId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FormTxnDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FormPaidAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    EmdTxnId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmdDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EmdAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    AllotmentTxnId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AllotmentDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AllotmentAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    DueAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    TotalDueWithInterest = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    Remarks = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<long>(type: "bigint", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiedBy = table.Column<long>(type: "bigint", nullable: true),
                    ApplicationStatusId = table.Column<int>(type: "int", nullable: true),
                    PlotStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PropertyCategoryId = table.Column<int>(type: "int", nullable: false),
                    PropertyCode = table.Column<string>(type: "nvarchar(max)", nullable: true)
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
                    table.ForeignKey(
                        name: "FK_PropertyBidderRegistration_BranchMaster_BranchId",
                        column: x => x.BranchId,
                        principalTable: "BranchMaster",
                        principalColumn: "BranchId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PropertyBidderRegistration_DistrictMaster_DistrictId",
                        column: x => x.DistrictId,
                        principalTable: "DistrictMaster",
                        principalColumn: "DistrictId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PropertyBidderRegistration_MandiMaster_MandiId",
                        column: x => x.MandiId,
                        principalTable: "MandiMaster",
                        principalColumn: "MandiId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PropertyBidderRegistration_PlanMaster_PlanId",
                        column: x => x.PlanId,
                        principalTable: "PlanMaster",
                        principalColumn: "PlanId");
                    table.ForeignKey(
                        name: "FK_PropertyBidderRegistration_PlotTypeMaster_PlotTypeId",
                        column: x => x.PlotTypeId,
                        principalTable: "PlotTypeMaster",
                        principalColumn: "PlotTypeId");
                    table.ForeignKey(
                        name: "FK_PropertyBidderRegistration_PropertyType_PropertyTypeId",
                        column: x => x.PropertyTypeId,
                        principalTable: "PropertyType",
                        principalColumn: "PropertyTypeId");
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
                name: "InstallmentDetails");

            migrationBuilder.DropTable(
                name: "PlotSizeMaster");

            migrationBuilder.DropTable(
                name: "PropertyBidderRegistration");

            migrationBuilder.DropTable(
                name: "PropertyCategoryMaster");

            migrationBuilder.DropTable(
                name: "ApplicationStatusMaster");

            migrationBuilder.DropTable(
                name: "BidderTypeMaster");

            migrationBuilder.DropTable(
                name: "BranchMaster");

            migrationBuilder.DropTable(
                name: "MandiMaster");

            migrationBuilder.DropTable(
                name: "PlanMaster");

            migrationBuilder.DropTable(
                name: "PlotTypeMaster");

            migrationBuilder.DropTable(
                name: "PropertyType");
        }
    }
}
