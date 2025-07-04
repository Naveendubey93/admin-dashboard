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

export interface PriceConfiguration {
  [key: string]: {
    priceType: 'base' | 'aditional',
    availableOptions: string[]
  }
}

export interface Attribute {
  name: string;
  widgetType: 'switch' | 'radio';
  defaultValue: string;
  availableOptions: string[];
}

export type Category = {
  _id: string;
  name: string;
  priceConfiguration: PriceConfiguration;
  attributes: Attribute[]
}

export type Product = {
  _id: string;
  name: string;
  description: string;
  // price: number;
  category: Category;
  createdAt: string;
  image: string
  isPublish: boolean

}