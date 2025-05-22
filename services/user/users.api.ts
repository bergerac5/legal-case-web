import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "@/lib/constants";
import {
  Lawyer,
  Role,
  CreateUserDto,
  User
}
  from "@/lib/userType";
import { getToken } from "@/utils/auth";

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
    const token = getToken(); // Get the stored JWT token

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${API_BASE_URL}/users/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("All users response:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        // Handle unauthorized error (token expired or invalid)
        throw new Error('Unauthorized - Please login again');
      }
      const errorMessage = error.response?.data?.message || 'Failed to fetch users';
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred while fetching users');
  }
}

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
    const token = getToken();

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.post(`${API_BASE_URL}/users/create`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log("User created:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        // Handle unauthorized error specifically
        throw new Error('Unauthorized - Please login again');
      }
      const errorMessage = error.response?.data?.message || 'Failed to create user';
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred while creating user');
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_BASE_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    console.log("Fetched user:", response.data); 

    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Failed to fetch user";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred while fetching the user");
  }
  
};


export const updateUser = async (
  id: string,
  updateUserDto: Partial<CreateUserDto> 
): Promise<User> => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.patch(`${API_BASE_URL}/users/${id}`, updateUserDto, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log("User updated:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Unauthorized - Please login again');
      }
      const errorMessage = error.response?.data?.message || 'Failed to update user';
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred while updating user');
  }
};
