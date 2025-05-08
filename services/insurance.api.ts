import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";
import { 
  CreatePropertyInput,  
  PaginatedResponse, 
  PaginatedClaimResponse, 
  ClaimPropertyInput,  
  PaginatedClientClaimResponse, 
  ClientClaim
} from "../lib/types"

export const getAllProperties = async (page: number): Promise<PaginatedResponse> => {
  const response = await axios.get(`${API_BASE_URL}/property/all?page=${page}&limit=10`);
  return response.data;
};

export const addProperty = async (property: CreatePropertyInput) => {
  const response = await axios.post(`${API_BASE_URL}/property/register`, property);
  return response.data;
};

export async function getPropertyById(id: string | number) {
  const response = await axios.get(`${API_BASE_URL}/property/${id}`);
  return response.data;
}

export const claimProperty = async (data: ClaimPropertyInput) => {
  const response = await axios.post(`${API_BASE_URL}/property/claim`, data);
  return response.data;
};

export const getAllPropertyClaims = async (page: number): Promise<PaginatedClaimResponse> => {
  const response = await axios.get(`${API_BASE_URL}/property/allclaim?page=${page}&limit=10`);
  return response.data;
};

export async function getAllClientClaims(page: number): Promise<PaginatedClientClaimResponse> {
  const res = await axios.get(`${API_BASE_URL}/client/claims?page=${page}`);
  return res.data;
}
export async function getClaimClaimById(id: string): Promise<ClientClaim> {
  const response = await axios.get(`${API_BASE_URL}/client/${id}`);
  return response.data;
}
export const updateClaimProgress = async ({
  id,
  claimProgress,
}: {
  id: string;
  claimProgress: "PENDING" | "COMPLETED" | "FAILED";
}) => {
  const response = await axios.patch(`${API_BASE_URL}/property/claim/${id}`, {
    claimProgress,
  });
  return response.data;
};

