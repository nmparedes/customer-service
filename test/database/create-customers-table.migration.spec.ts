import { QueryRunner } from "typeorm";
import { CreateCustomersTable1769200000000 } from "../../src/database/migrations/1769200000000-CreateCustomersTable";

describe("CreateCustomersTable1769200000000", () => {
  it("creates and drops the customers table with indexes", async () => {
    const migration = new CreateCustomersTable1769200000000();
    const queryRunner = {
      createTable: jest.fn(),
      createIndex: jest.fn(),
      dropIndex: jest.fn(),
      dropTable: jest.fn(),
    } as unknown as jest.Mocked<QueryRunner>;

    await migration.up(queryRunner);
    await migration.down(queryRunner);

    expect(migration.name).toBe("CreateCustomersTable1769200000000");
    expect(queryRunner.createTable).toHaveBeenCalledWith(
      expect.objectContaining({ name: "customers" }),
    );
    expect(queryRunner.createIndex).toHaveBeenCalledTimes(2);
    expect(queryRunner.dropIndex).toHaveBeenCalledWith(
      "customers",
      "idx_customers_email",
    );
    expect(queryRunner.dropTable).toHaveBeenCalledWith("customers");
  });
});
