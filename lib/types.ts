// Core Entity Interfaces
export interface Client {
  id: string;
  name: string;
  poc: string;
  phone: string;
  address: string;
  created_at: string | Date;
  updated_at: string | Date;
  cases?: Case[]; // Optional relation
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: UserRole;
}

export enum UserRole {
  LAWYER = 'lawyer',
  ADMIN = 'admin',
  STAFF = 'staff'
}

export enum CaseStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold'
}

export interface Case {
  id: string;
  classification: string;
  type: string;
  status: CaseStatus;
  client_id: string;
  lawyer_id: string;
  client?: Client;
  lawyer?: User;
  hearings?: Hearing[];
  documents?: Document[];
  created_at: string | Date;
  updated_at: string | Date;
}

export interface ExpandedCase extends Case {
  client: Client;
  lawyer: User;
  hearings: Hearing[];
  documents: Document[];
}

export interface Hearing {
  id: string;
  schedule: string | Date;
  notes?: string;
  location?: string;
}

export interface Document {
  id: string;
  filename: string;
  url?: string;
  uploaded_at: string | Date;
}

// Pagination Interfaces
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type PaginatedClientResponse = PaginatedResponse<Client>;
export type PaginatedCaseResponse = PaginatedResponse<Case | ExpandedCase>;

// DTO Interfaces
export interface ClientDto {
  name: string;
  poc: string;
  phone: string;
  address: string;
}

export interface CreateCaseDto {
  classification: string;
  type: string;
  client_id: string;
  lawyer_id: string;
  status?: CaseStatus;
}

export interface UpdateCaseDto {
  classification?: string;
  type?: string;
  status?: CaseStatus;
  client_id?: string;
  lawyer_id?: string;
}