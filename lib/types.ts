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
  
  export interface PaginatedResponse {
    data: Property[];
    total: number;
    page: number;
    totalPages: number;
  }
  
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

  
   