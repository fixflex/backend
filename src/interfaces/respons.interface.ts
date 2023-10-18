export interface IPagination {
  currentPage: number;
  totalDocuments?: number;
  limit: number;
  skip: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  nextPage?: number;
  prevPage?: number;
}
