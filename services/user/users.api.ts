import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "@/lib/constants";

export const getLawyers = async (): Promise<Lawyer[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/lawyers`);
    console.log("Lawyers response:", response.data); 
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch lawyers';
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred while fetching lawyers');
  }
};

