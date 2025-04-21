import axios from "axios";
import { API_BASE_URL } from "../lib/server";

export const getUsers = async () => {
  const res = await axios.get(`${API_BASE_URL}/users/list`);
  return res.data;
};

export const createUser = async (userData: { name: string; email: string; phone: string; password: string; role_id?: number }) => {
  const res = await axios.post(`${API_BASE_URL}/users`, userData);
  return res.data;
};
