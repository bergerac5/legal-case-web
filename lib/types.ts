

export interface Client {
  id: string;
  names: string;
  poc: string;
  phoneNumber: string;
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
export type PaginatedPropertyResponse = PaginatedResponse<Property>;

// DTO Interfaces
export interface ClientDto {
  names: string;
  poc: string;
  phoneNumber: string;
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

export interface CreatePropertyInput {
    name: string;
    price: number;
    department: string;
    location: string;
    boughtTime: string;
    manufacturer: string;
    status: boolean;
    supplier: string;
  }
  
  export interface Property {
    id: number;
    name: string;
    price: number;
    department: string;
    location: string;
    boughtTime: string;
    manufacturer: string;
    status: boolean;
    supplier: string;
  }
  
  // export interface PaginatedResponse {
  //   data: Property[];
  //   total: number;
  //   page: number;
  //   totalPages: number;
  // }
  
  export interface PaginatedClaimResponse {
    data: InsuranceClaim[];
    total: number;
    page: number;
    totalPages: number;
  }
  
  export interface ClaimPropertyInput {
    property_id: string;
    type: "Client" | "REG";
    claimProgress: "PENDING" | "COMPLETED" | "FAILED";
    dateOfClaim: string;
    description: string;
    claimAmount: number;
  }
  
  export interface InsuranceClaim {
    id: string;
    type: string;
    claimProgress: string;
    dateOfClaim: string;
    description: string;
    claimAmount: number;
    property: {
      id: string;
      name: string;
      department: string;
      location: string;
    };
  }

  export interface PaginatedClientClaimResponse {
    data: ClientClaim[];
    total: number;
    page: number;
    totalPages: number;
  }
  
  export interface ClientClaim {
    claimId: string;
    type: string;
    claimProgress: string;
    dateOfClaim: string;
    description: string;
    claimAmount: number;
    damagedItems: { id: string; itemName: string; claim_id: string }[];
    client: {
      names: string;
      poc: string;
      phoneNumber: string;
      address: string;
    };
    result?: {
      decision: string;
      reason: string;
      amountApproved: number;
      reviewedAt: string;
    };
  }
  
export interface DamagedItem {
  itemName: string;
}

export interface ClientInfo {
  names: string;
  poc: string;
  phoneNumber: string;
  address: string;
}

export interface CreateFullClaimDto {
  client: ClientInfo;
  type: "Client";
  claimProgress: "PENDING";
  dateOfClaim: string;
  description: string;
  claimAmount: number;
  damagedItems: DamagedItem[];
}

export interface ClaimSummary {
  Client: {
    pending: number;
    completed: number;
    failed: number;
    total: number;
  };
  REG: {
    pending: number;
    completed: number;
    failed: number;
    total: number;
  };
}
export interface AddClaimResultInput {
  claimId: string;
  decision: string;
  reason: string;
  amountApproved: number;
}


  

