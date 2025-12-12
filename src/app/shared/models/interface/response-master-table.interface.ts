export interface Parameter  {
  parameterName: string;
  parameterValue: string;
}
export interface CellContent  {
  contentType: string;
  content: string[];
  action?: string;
  pageName?: string;
  parameters?: Parameter [];
}
export interface Cell {
  columnName: string;
  cellContent: CellContent [];
}
export interface Pagination {
  totalRecords: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  url?: string;
}
export interface MasterTableResponse {
  data?: Cell[][];
  pagination?: Pagination;
  messages?: Message[];
}

interface Message {
  type: string;
  description: string;
}
