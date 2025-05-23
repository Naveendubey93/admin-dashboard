// Auth Service

import { Credentials } from '../types';
import { api } from './client';

export const login = async (credential: Credentials) =>  await  api.post('/auth/login', credential);
export const self = async () => await api.get('/auth/self');
export const logout = async () => await api.post('/auth/logout');
export const getUsers = async () => await api.get('/users');
export const getTenants = async () => await api.get('/tenants');
