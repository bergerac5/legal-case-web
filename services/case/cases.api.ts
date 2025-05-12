import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "@/lib/constants";
import { 
  PaginatedCaseResponse,
  CreateCaseDto,
  UpdateCaseDto,
  CaseStatus
} from "@/lib/types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export const getAllCases = async (
  page: number, 
  limit: number = 5
): Promise<PaginatedCaseResponse> => {
  try {
    const response = await axios.get<PaginatedCaseResponse>(
      `${API_BASE_URL}/cases`,
      { params: { page, limit } }
    );
    return response.data; // Directly return the response data
  } catch (error) {
    // Return empty response on error
    return {
      data: [],
      meta: {
        total: 0,
        page,
        limit,
        totalPages: 0,
      }
    };
  }
};

export const createCase = async (caseData: CreateCaseDto) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cases`, caseData);
    return response.data;
  } catch (error) {
    handleCaseError(error, 'Failed to create case');
  }
};

export const getCaseById = async (id: string) => {
  if (!id) throw new Error('Case ID is required');
  try {
    const response = await axios.get(`${API_BASE_URL}/cases/${id}`);
    return response.data;
  } catch (error) {
    handleCaseError(error, 'Failed to fetch case');
  }
};

export const updateCase = async (id: string, caseData: UpdateCaseDto) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/cases/${id}`, caseData);
    return response.data;
  } catch (error) {
    handleCaseError(error, 'Failed to update case');
  }
};

export const updateCaseStatus = async (id: string, data: { status: CaseStatus }) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/cases/status/${id}`, data);
    return response.data;
  } catch (error) {
    handleCaseError(error, 'Failed to update case status');
  }
};

export const deleteCase = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/cases/${id}`);
    return response.data;
  } catch (error) {
    handleCaseError(error, 'Failed to delete case');
  }
};

// Error handling utility
const handleCaseError = (error: unknown, defaultMessage: string) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>; // Properly typed
    const responseData = axiosError.response?.data;
    
    if (axiosError.response?.status === 404) {
      throw new Error('Case not found');
    }
    if (axiosError.response?.status === 400) {
      throw new Error(responseData?.message || 'Invalid request');
    }
    throw new Error(axiosError.message || defaultMessage);
  }
  throw new Error(defaultMessage);
};

interface ErrorResponse {
  message?: string;
};

// Organized API object
export const caseAPI = {
  getAll: getAllCases,
  create: createCase,
  getById: getCaseById,
  update: updateCase,
  updateStatus: updateCaseStatus,
  delete: deleteCase,
};