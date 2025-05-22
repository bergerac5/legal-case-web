export interface Lawyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  is_active: boolean;
}

export interface CreateUserDto {
  name: string;
  email: string;
  phone: string;
  is_active?: boolean;
  is_default_password?: boolean;
  OTP_number?: string;
  OTP_life_time?: string;
  last_login?: string;
  role_id: string;
  created_by?: string;
  updated_by?: string;
}

export type Role = {
  id: string;
  name: string;
  description: string;
};

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  
}