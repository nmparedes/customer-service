import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { DocumentType } from "../../domain/enums/document-type.enum";

@Entity("customers")
export class CustomerOrmEntity {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;

  @Column({ type: "enum", enum: DocumentType, nullable: false })
  document_type: DocumentType;

  @Index()
  @Column({ type: "varchar", length: 14, nullable: false, unique: true })
  document_value: string;

  @Index()
  @Column({ type: "varchar", length: 255, nullable: false })
  email: string;

  @Column({ type: "varchar", length: 20, nullable: false })
  phone: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  address_street: string;

  @Column({ type: "varchar", length: 20, nullable: false })
  address_number: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  address_complement: string | null;

  @Column({ type: "varchar", length: 100, nullable: false })
  address_neighborhood: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  address_city: string;

  @Column({ type: "char", length: 2, nullable: false })
  address_state: string;

  @Column({ type: "varchar", length: 9, nullable: false })
  address_zip_code: string;

  @Column({ type: "boolean", default: true })
  active: boolean;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updated_at: Date;
}
