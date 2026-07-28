export interface CustomerFilters {
  name?: string;
  document?: string;
  active?: boolean;
  page?: number;
  limit?: number;
  orderBy?: "name" | "createdAt";
  order?: "ASC" | "DESC";
}
