import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";
import { 
  CreatePropertyInput,  
  PaginatedResponse, 
  PaginatedClaimResponse, 
  ClaimPropertyInput,  
  PaginatedClientClaimResponse, 
  ClientClaim,
  CreateFullClaimDto,
  ClaimSummary,
  AddClaimResultInput
} from "../lib/types"

//Get all Properties Api Call
export const getAllProperties = async (page: number): Promise<PaginatedResponse> => {
  const response = await axios.get(`${API_BASE_URL}/property/all?page=${page}&limit=10`);
  return response.data;
};

//Add All Property Api Call 
export const addProperty = async (property: CreatePropertyInput) => {
  const response = await axios.post(`${API_BASE_URL}/property/register`, property);
  return response.data;
};

//GetPropertyById Api Call
export async function getPropertyById(id: string | number) {
  const response = await axios.get(`${API_BASE_URL}/property/${id}`);
  return response.data;
}

//Add PropertyClaim Api Call 
export const claimProperty = async (data: ClaimPropertyInput) => {
  const response = await axios.post(`${API_BASE_URL}/property/claim`, data);
  return response.data;
};

//Get AllPropertyClaims Api Call
export const getAllPropertyClaims = async (page: number): Promise<PaginatedClaimResponse> => {
  const response = await axios.get(`${API_BASE_URL}/property/allclaim?page=${page}&limit=10`);
  return response.data;
};

//Get SinglePropertyClaim Api Call
export const getSinglePropertyClaim = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/property/single-claim/${id}`);
  return response.data;
};


//Gat AllClientClaim Api Call
export async function getAllClientClaims(page: number): Promise<PaginatedClientClaimResponse> {
  const res = await axios.get(`${API_BASE_URL}/client/claims?page=${page}`);
  return res.data;
}

//Get ClientClaimByItsId Api Call
export async function getClaimClaimById(id: string): Promise<ClientClaim> {
  const response = await axios.get(`${API_BASE_URL}/client/${id}`);
  return response.data;
}

//Update ClientClaimProgress Api Call
export const updateClaimProgress = async ({
  id,
  claimProgress,
}: {
  id: string;
  claimProgress: "PENDING" | "COMPLETED" | "FAILED";
}) => {
  const response = await axios.put(`${API_BASE_URL}/client/update/${id}`, {
    claimProgress,
  });
  return response.data;
};

//Adding Claim Of Client Api Call 
export const addClientClaim = async (clientclaim: CreateFullClaimDto) => {
  const response = await axios.post(`${API_BASE_URL}/client/claim`, clientclaim);
  return response.data;
};

// Get Claim Summary (REG and Client totals)
export async function getClaimSummary(): Promise<ClaimSummary> {
  const response = await axios.get(`${API_BASE_URL}/client/summary`);
  return response.data;
}

//add result on claim
export const addClaimResult = async (data: AddClaimResultInput) => {
  const response = await axios.post(`${API_BASE_URL}/client/result`, data);
  return response.data;
};
