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

export const addProperty = async (property: CreatePropertyInput) => {
  const response =await axios.post(`${API_BASE_URL}/property/register`,{ property});
  return response.data;
};
export const getAllProperties = async (): Promise<Property[]> => {
    const response = await axios.get(`${API_BASE_URL}/property/all`);
    return response.data;
  };
