import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateVehiclesTable1769201000000 implements MigrationInterface {
  name = "CreateVehiclesTable1769201000000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "vehicles",
        columns: [
          { name: "id", type: "varchar", length: "36", isPrimary: true },
          {
            name: "license_plate",
            type: "varchar",
            length: "7",
            isNullable: false,
            isUnique: true,
          },
          { name: "make", type: "varchar", length: "100", isNullable: false },
          { name: "model", type: "varchar", length: "100", isNullable: false },
          { name: "year", type: "int", isNullable: false },
          { name: "color", type: "varchar", length: "50", isNullable: true },
          {
            name: "customer_id",
            type: "varchar",
            length: "36",
            isNullable: false,
          },
          {
            name: "active",
            type: "boolean",
            default: true,
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      "vehicles",
      new TableIndex({
        name: "idx_vehicles_license_plate",
        columnNames: ["license_plate"],
        isUnique: true,
      }),
    );
    await queryRunner.createIndex(
      "vehicles",
      new TableIndex({
        name: "idx_vehicles_customer_id",
        columnNames: ["customer_id"],
      }),
    );
    await queryRunner.createForeignKey(
      "vehicles",
      new TableForeignKey({
        name: "fk_vehicles_customer_id",
        columnNames: ["customer_id"],
        referencedTableName: "customers",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("vehicles", "fk_vehicles_customer_id");
    await queryRunner.dropIndex("vehicles", "idx_vehicles_customer_id");
    await queryRunner.dropIndex("vehicles", "idx_vehicles_license_plate");
    await queryRunner.dropTable("vehicles");
  }
}
