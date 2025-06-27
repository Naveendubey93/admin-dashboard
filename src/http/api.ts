// Auth Service

import { CreateTenantData, CreateUserData, Credentials } from '../types';
import { api } from './client';

export const AUTH_SERVICE = '/api/auth';
const CATELOG_SERVICE = '/api/catalog';

export const login = async (credential: Credentials) =>  await  api.post(`${AUTH_SERVICE}/auth/login`, credential);
export const self = async () => await api.get(`${AUTH_SERVICE}/auth/self`);
export const logout = async () => await api.post(`${AUTH_SERVICE}/auth/logout`);
export const getUsers = async (queryString: string) => await api.get(`${AUTH_SERVICE}/users?${queryString}`);
export const getTenants = async (queryString: string) => await api.get(`${AUTH_SERVICE}/tenants?` + queryString);
export const createUser = async ( user: CreateUserData) => await api.post(`${AUTH_SERVICE}/users`, user);
export const updateUser = async (user: CreateUserData, id: string) => await api.patch(`${AUTH_SERVICE}/users/${id}`, user);
export const createTenant = async (tenant: CreateTenantData) => await api.post(`${AUTH_SERVICE}/tenants`, tenant);

//  Catelog Service
export const getCategories = async (queryString: string) => await api.get(`${CATELOG_SERVICE}/categories?` + queryString);
export const getProducts = (queryparams: string) => api.get(`${CATELOG_SERVICE}/products?${queryparams}`);