import axios, { isAxiosError } from "axios";

export type RoleName = "ADMIN" | "CLIENTE" | "PRESTAMISTA";

export interface AuthUser {
  id_user: number;
  email: string;
  nombre: string;
  apellido: string;
  roles?: RoleName[];
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
});

export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await api.post<AuthUser>("/auth/login", { email, password });
  return res.data;
}

export interface SignupPayload {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  id_localidad?: number | null;
  roles?: RoleName[]; 
}

export async function signup(data: SignupPayload): Promise<AuthUser> {
  const res = await api.post<AuthUser>("/usuarios", data);
  return res.data;
}

export function getApiErrorMessage(e: unknown, fallback = "Error"): string {
  if (isAxiosError(e)) return e.response?.data?.message ?? fallback;
  if (e instanceof Error) return e.message;
  return fallback;
}
