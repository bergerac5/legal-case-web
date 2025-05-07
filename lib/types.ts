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
  
  export interface Client {
    names: string;
    poc: string;
    phoneNumber: string;
    address: string;
  }
  
  export interface DamageDetail {
    itemName: string;
  }
  
  export interface ClientClaim {
    id: string;
    type: string;
    claimProgress: string;
    claimAmount: number;
    dateOfClaim: string;
    description: string;
    client: Client;
    damageDetails: DamageDetail[];
  }
  
  export interface PaginatedClientClaimResponse {
    data: ClientClaim[];
    total: number;
    page: number;
    totalPages: number;
  }
  