import axios from "axios";
import {API_BASE_URL} from "@/lib/constants";
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
interface Property {
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

interface PaginatedResponse {
  data: Property[];
  total: number;
  page: number;
  totalPages: number;
}
interface PaginatedClaimResponse {
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
export const getAllProperties = async (page: number): Promise<PaginatedResponse> => {
  const response = await axios.get(`${API_BASE_URL}/property/all?page=${page}&limit=10`);
  return response.data;
};


export const addProperty = async (property: CreatePropertyInput) => {
  const response =await axios.post(`${API_BASE_URL}/property/register`,property);
  return response.data;
};
export async function getPropertyById(id: string | number) {
  const response = await axios.get(`${API_BASE_URL}/property/${id}`);
  return response.data
}
export const claimProperty = async (data: ClaimPropertyInput) => {
  const response = await axios.post(`${API_BASE_URL}/property/claim`, data);
  return response.data;
};

export const getAllPropertyClaims = async (page: number): Promise<PaginatedClaimResponse> => {
  const response = await axios.get(`${API_BASE_URL}/property/allclaim?page=${page}&limit=10`);
  return response.data;
};





