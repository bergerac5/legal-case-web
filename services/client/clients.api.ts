import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "@/lib/constants";
import { 
  PaginatedClientResponse,
  ClientDto
} from "@/lib/types"

export const getAllClients = async (page: number) => {
  const response = await axios.get(`${API_BASE_URL}/clients`, {
    params: { page, limit: 10 }
  });
  return response.data; 
};

export const createClient = async (client: ClientDto) => {
  const response = await axios.post(`${API_BASE_URL}/clients`, client);
  return response.data;
};

export const getClientById = async (id: string) => {

  if (!id) throw new Error('Client ID is required');
  try {
    const response = await axios.get(`${API_BASE_URL}/clients/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        throw new Error('Client not found');
      }
      throw new Error(axiosError.message || 'Failed to fetch client');
    }
    throw new Error('Unknown error occurred while fetching client');
  }
};

export const updateClient = async (id: string, clientData: ClientDto) => {
  const response = await axios.patch(`${API_BASE_URL}/clients/${id}`, clientData);
  return response.data;
};

export const deleteClient = async (id: string) => {
  const response = await axios.delete(`${API_BASE_URL}/clients/${id}`);
  return response.data;
};

export const getClientByPoc = async (poc: string): Promise<{ id: string; name: string }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/clients/by-poc/${poc}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Client not found with the specified POC');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch client by POC');
    }
    throw error;
  }
};

// Additional utility functions
export const clientAPI = {
  getAll: getAllClients,
  create: createClient,
  getById: getClientById,
  update: updateClient,
  delete: deleteClient,
};