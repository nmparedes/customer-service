import { QueryRunner } from "typeorm";
import { CreateVehiclesTable1769201000000 } from "../../src/database/migrations/1769201000000-CreateVehiclesTable";

describe("CreateVehiclesTable1769201000000", () => {
  it("creates and drops the vehicles table with indexes and internal customer FK", async () => {
    const migration = new CreateVehiclesTable1769201000000();
    const queryRunner = {
      createTable: jest.fn(),
      createIndex: jest.fn(),
      createForeignKey: jest.fn(),
      dropForeignKey: jest.fn(),
      dropIndex: jest.fn(),
      dropTable: jest.fn(),
    } as unknown as jest.Mocked<QueryRunner>;

    await migration.up(queryRunner);
    await migration.down(queryRunner);

    expect(migration.name).toBe("CreateVehiclesTable1769201000000");
    expect(queryRunner.createTable).toHaveBeenCalledWith(
      expect.objectContaining({ name: "vehicles" }),
    );
    expect(queryRunner.createIndex).toHaveBeenCalledTimes(2);
    expect(queryRunner.createForeignKey).toHaveBeenCalledWith(
      "vehicles",
      expect.objectContaining({
        name: "fk_vehicles_customer_id",
        referencedTableName: "customers",
      }),
    );
    expect(queryRunner.dropForeignKey).toHaveBeenCalledWith(
      "vehicles",
      "fk_vehicles_customer_id",
    );
    expect(queryRunner.dropTable).toHaveBeenCalledWith("vehicles");
  });
});
