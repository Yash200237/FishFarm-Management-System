using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace App.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MakeCertifiedUntilDateOnly : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_FarmWorkers_CertifiedUntil_FutureOrNull",
                table: "FarmWorkers");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "CertifiedUntil",
                table: "FarmWorkers",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldNullable: true);

            migrationBuilder.AddCheckConstraint(
                name: "CK_FarmWorkers_CertifiedUntil_FutureOrNull",
                table: "FarmWorkers",
                sql: "[CertifiedUntil] IS NULL OR [CertifiedUntil] >= CONVERT(date, GETUTCDATE())");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_FarmWorkers_CertifiedUntil_FutureOrNull",
                table: "FarmWorkers");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CertifiedUntil",
                table: "FarmWorkers",
                type: "datetime2(7)",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AddCheckConstraint(
                name: "CK_FarmWorkers_CertifiedUntil_FutureOrNull",
                table: "FarmWorkers",
                sql: "[CertifiedUntil] IS NULL OR [CertifiedUntil] >= GETUTCDATE()");
        }
    }
}
