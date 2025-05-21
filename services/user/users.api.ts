import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "@/lib/constants";
import { Lawyer,
         Role,
         CreateUserDto 
      } 
 from "@/lib/userType";

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

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/all`);
    console.log("All users response:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch users';
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred while fetching users');
  }
};

export const getAllRoles = async (): Promise<Role[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/roles/all`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch roles';
        throw new Error(errorMessage);
      }
      throw new Error('An unexpected error occurred while fetching roles');
    }
}

export const createUser = async (userData: CreateUserDto): Promise<User> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/create`, userData);
    console.log("User created:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Failed to create user';
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred while creating user');
  }
};