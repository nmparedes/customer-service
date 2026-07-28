import "reflect-metadata";
import { DataSource } from "typeorm";
import { CustomerOrmEntity } from "../customer/infrastructure/typeorm/customer.orm-entity";
import { VehicleOrmEntity } from "../vehicle/infrastructure/typeorm/vehicle.orm-entity";
import { CreateCustomersTable1769200000000 } from "./migrations/1769200000000-CreateCustomersTable";
import { CreateVehiclesTable1769201000000 } from "./migrations/1769201000000-CreateVehiclesTable";

function readNumber(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readBoolean(value: string | undefined): boolean {
  return value === "true";
}

const customerServiceDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST ?? "localhost",
  port: readNumber(process.env.DB_PORT, 3306),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: readBoolean(process.env.DB_SSL) ? { rejectUnauthorized: true } : false,
  synchronize: false,
  logging: false,
  entities: [CustomerOrmEntity, VehicleOrmEntity],
  migrations: [
    CreateCustomersTable1769200000000,
    CreateVehiclesTable1769201000000,
  ],
});

export default customerServiceDataSource;
