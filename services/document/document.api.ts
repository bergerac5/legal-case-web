// document.api.ts
import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "@/lib/constants";
import { CreateDocumentDto, UpdateDocumentDto } from "@/lib/documentType";

export const getAllDocuments = async (caseId?: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/documents`, {
      params: caseId ? { caseId } : {},
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch documents");
  }
};

export const getDocumentById = async (id: string) => {
  if (!id) throw new Error("Document ID is required");
  try {
    const response = await axios.get(`${API_BASE_URL}/documents/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Document not found");
      }
      throw new Error(error.message || "Failed to fetch document");
    }
    throw error;
  }
};

export const createDocument = async (dto: CreateDocumentDto, file: File) => {
  const formData = new FormData();
  formData.append("case_id", dto.case_id);
  formData.append("filename", dto.filename);
  formData.append("file_type", dto.file_type);
  formData.append("file", file);

  try {
    const response = await axios.post(`${API_BASE_URL}/documents`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to upload document");
    }
    throw error;
  }
};

export const updateDocument = async (id: string, dto: UpdateDocumentDto, file?: File) => {
  const formData = new FormData();
  if (dto.filename) formData.append("filename", dto.filename);
  if (dto.file_type) formData.append("file_type", dto.file_type);
  if (file) formData.append("file", file);

  try {
    const response = await axios.patch(`${API_BASE_URL}/documents/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to update document");
    }
    throw error;
  }
};

export const deleteDocument = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/documents/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete document");
  }
};

// document.api.ts
export const downloadDocument = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/documents/${id}/download`, {
      responseType: 'blob',
    });
    return {
      blob: response.data,
      contentType: response.headers['content-type'],
      contentDisposition: response.headers['content-disposition']
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage || "Failed to download document");
    }
    throw error;
  }
};

export const documentAPI = {
  getAll: getAllDocuments,
  getById: getDocumentById,
  create: createDocument,
  update: updateDocument,
  delete: deleteDocument,
  download: downloadDocument,
};