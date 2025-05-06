import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";
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

export const getAllProperties = async (page: number): Promise<PaginatedResponse> => {
  const response = await axios.get(`${API_BASE_URL}/property/all?page=${page}&limit=10`);
  return response.data;
};


export const addProperty = async (property: CreatePropertyInput) => {
  const response =await axios.post(`${API_BASE_URL}/property/register`,{ property});
  return response.data;
};
export async function getPropertyById(id: string | number) {
  const response = await axios.get(`${API_BASE_URL}/property/${id}`);
  return response.data
}

export async function claimProperty(id: string | number) {
  const res = await fetch(`/api/claims`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ propertyId: id }),
  });
  if (!res.ok) throw new Error("Failed to submit claim");
  return res.json();
}

