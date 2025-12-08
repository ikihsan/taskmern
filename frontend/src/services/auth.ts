import api from './api';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth';

const unwrap = (response: { data: { data: AuthResponse } }) => response.data.data;

export const loginRequest = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', payload);
  return unwrap(response);
};

export const registerRequest = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', payload);
  return unwrap(response);
};
