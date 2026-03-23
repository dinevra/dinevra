import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export interface Location {
  id: string;
  organization_id: string;
  name: string;
  code?: string;
  type?: string;
  address_line1: string;
  address_line2?: string;
  landmark?: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
  timezone?: string;
  currency?: string;
  languages?: string[];
  date_format?: string;
  time_format?: string;
  week_start_day?: number;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  opening_date?: string;
  tax_region?: string;
  supports_pickup: boolean;
  supports_delivery: boolean;
  supports_dine_in: boolean;
  supports_pre_order: boolean;
  supports_same_day_ordering: boolean;
  latitude?: number;
  longitude?: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLocationRequest extends Partial<Omit<Location, 'id' | 'created_at' | 'updated_at'>> {
  organization_id: string;
  name: string;
  address_line1: string;
  city: string;
  country: string;
}

const getAuthHeader = () => {
  const token = localStorage.getItem('dinevra_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const locationsApi = {
  list: async (params?: { country?: string; city?: string; status?: string }) => {
    const response = await axios.get<{ locations: Location[] }>(`${API_URL}/locations`, {
      params,
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axios.get<Location>(`${API_URL}/locations/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  create: async (data: CreateLocationRequest) => {
    const response = await axios.post<Location>(`${API_URL}/locations`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  update: async (id: string, data: Partial<Location>) => {
    const response = await axios.put<Location>(`${API_URL}/locations/${id}`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axios.delete(`${API_URL}/locations/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getByOrg: async (orgId: string) => {
    const response = await axios.get<{ locations: Location[] }>(`${API_URL}/locations/org/${orgId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};
