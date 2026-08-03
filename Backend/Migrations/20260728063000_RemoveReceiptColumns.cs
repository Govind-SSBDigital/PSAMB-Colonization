using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class RemoveReceiptColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DraftAmount",
                table: "PropertyBidderRegistration");

            migrationBuilder.DropColumn(
                name: "DraftBank",
                table: "PropertyBidderRegistration");

            migrationBuilder.DropColumn(
                name: "DraftDate",
                table: "PropertyBidderRegistration");

            migrationBuilder.DropColumn(
                name: "DraftNo",
                table: "PropertyBidderRegistration");

            migrationBuilder.DropColumn(
                name: "InterestAmount",
                table: "PropertyBidderRegistration");

            migrationBuilder.DropColumn(
                name: "OtherAmount",
                table: "PropertyBidderRegistration");

            migrationBuilder.DropColumn(
                name: "PaymentType",
                table: "PropertyBidderRegistration");

            migrationBuilder.DropColumn(
                name: "PenaltyAmount",
                table: "PropertyBidderRegistration");

            migrationBuilder.DropColumn(
                name: "PrincipalAmount",
                table: "PropertyBidderRegistration");

            migrationBuilder.DropColumn(
                name: "ReceiptDate",
                table: "PropertyBidderRegistration");

            migrationBuilder.DropColumn(
                name: "ReceiptNo",
                table: "PropertyBidderRegistration");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "DraftAmount",
                table: "PropertyBidderRegistration",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DraftBank",
                table: "PropertyBidderRegistration",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DraftDate",
                table: "PropertyBidderRegistration",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DraftNo",
                table: "PropertyBidderRegistration",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "InterestAmount",
                table: "PropertyBidderRegistration",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "OtherAmount",
                table: "PropertyBidderRegistration",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentType",
                table: "PropertyBidderRegistration",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PenaltyAmount",
                table: "PropertyBidderRegistration",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PrincipalAmount",
                table: "PropertyBidderRegistration",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ReceiptDate",
                table: "PropertyBidderRegistration",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReceiptNo",
                table: "PropertyBidderRegistration",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
