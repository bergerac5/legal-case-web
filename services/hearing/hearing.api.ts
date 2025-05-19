import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '@/lib/constants';
import {
  Hearing,
  CreateHearingDto,
  UpdateHearingDto
} from '@/lib/hearing.types';

export const getAllHearings = async (caseId?: string): Promise<Hearing[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/hearings`, {
      params: caseId ? { caseId } : {}
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch hearings');
    }
    throw new Error('Failed to fetch hearings');
  }
};

export const getHearingById = async (id: string): Promise<Hearing> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/hearings/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Hearing not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch hearing');
    }
    throw new Error('Failed to fetch hearing');
  }
};

export const createHearing = async (dto: CreateHearingDto): Promise<Hearing> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/hearings`, dto);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create hearing');
    }
    throw new Error('Failed to create hearing');
  }
};

export const updateHearing = async (
  id: string,
  dto: UpdateHearingDto
): Promise<Hearing> => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/hearings/${id}`, dto);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update hearing');
    }
    throw new Error('Failed to update hearing');
  }
};

export const deleteHearing = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/hearings/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete hearing');
    }
    throw new Error('Failed to delete hearing');
  }
};

export const hearingAPI = {
  getAll: getAllHearings,
  getById: getHearingById,
  create: createHearing,
  update: updateHearing,
  delete: deleteHearing,
};