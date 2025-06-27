export type Credentials = {
  email: string,
  password: string
}

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  tenant?: Tenant;
}

export type CreateUserData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  tenantId: number;
  createdAt: string;
}

export type Tenant = {
  id: number;
  name: string;
  address: string;
}

export type CreateTenantData = {
  name: string;
  address: string;
  createdAt: string;
}

export type FieldData = {
  name: string;
  value?: string | number | boolean;
}

export type Category = {
  _id: string;
  name: string;
}
