import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateCustomersTable1769200000000 implements MigrationInterface {
  name = "CreateCustomersTable1769200000000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "customers",
        columns: [
          { name: "id", type: "varchar", length: "36", isPrimary: true },
          { name: "name", type: "varchar", length: "255", isNullable: false },
          {
            name: "document_type",
            type: "enum",
            enum: ["CPF", "CNPJ"],
            isNullable: false,
          },
          {
            name: "document_value",
            type: "varchar",
            length: "14",
            isNullable: false,
            isUnique: true,
          },
          { name: "email", type: "varchar", length: "255", isNullable: false },
          { name: "phone", type: "varchar", length: "20", isNullable: false },
          {
            name: "address_street",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "address_number",
            type: "varchar",
            length: "20",
            isNullable: false,
          },
          {
            name: "address_complement",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "address_neighborhood",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "address_city",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "address_state",
            type: "char",
            length: "2",
            isNullable: false,
          },
          {
            name: "address_zip_code",
            type: "varchar",
            length: "9",
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
      "customers",
      new TableIndex({
        name: "idx_customers_document_value",
        columnNames: ["document_value"],
      }),
    );
    await queryRunner.createIndex(
      "customers",
      new TableIndex({
        name: "idx_customers_email",
        columnNames: ["email"],
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex("customers", "idx_customers_email");
    await queryRunner.dropIndex("customers", "idx_customers_document_value");
    await queryRunner.dropTable("customers");
  }
}
