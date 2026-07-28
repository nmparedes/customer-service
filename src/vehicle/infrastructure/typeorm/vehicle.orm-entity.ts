import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { CustomerOrmEntity } from "../../../customer/infrastructure/typeorm/customer.orm-entity";

@Entity("vehicles")
@Index("idx_vehicles_license_plate", ["license_plate"], { unique: true })
@Index("idx_vehicles_customer_id", ["customer_id"])
export class VehicleOrmEntity {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 7, nullable: false, unique: true })
  license_plate: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  make: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  model: string;

  @Column({ type: "int", nullable: false })
  year: number;

  @Column({ type: "varchar", length: 50, nullable: true })
  color: string | null;

  @Column({ type: "varchar", length: 36, nullable: false })
  customer_id: string;

  @Column({ type: "boolean", default: true })
  active: boolean;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updated_at: Date;

  @ManyToOne(() => CustomerOrmEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "customer_id" })
  customer: CustomerOrmEntity;
}
