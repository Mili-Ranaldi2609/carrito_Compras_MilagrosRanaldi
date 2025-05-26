interface FacturaFilterOptions {
  email: string;
  page?: number;
  limit?: number;
  order?: 'ASC' | 'DESC';
  fecha?: string;
}