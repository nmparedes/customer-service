export interface VehicleFilters {
  licensePlate?: string;
  make?: string;
  model?: string;
  year?: number;
  minimumYear?: number;
  maximumYear?: number;
  customerId?: string;
  active?: boolean;
  page?: number;
  limit?: number;
  orderBy?: "licensePlate" | "make" | "year" | "createdAt";
  order?: "ASC" | "DESC";
}
