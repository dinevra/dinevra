import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export interface Kitchen {
  id: string;
  location_id: string;
  name: string;
  code?: string;
  display_name?: string;
  type?: string;
  prep_type?: string;
  capacity_per_slot?: number;
  avg_prep_time_mins?: number;
  buffer_time_mins?: number;
  max_concurrent_orders?: number;
  priority: number;
  supports_pickup: boolean;
  supports_delivery: boolean;
  supports_dine_in: boolean;
  supports_scheduled_orders: boolean;
  supports_instant_orders: boolean;
  visible_to_customers: boolean;
  internal_only: boolean;
  kitchen_login_enabled: boolean;
  require_pin_login: boolean;
  device_restriction_enabled: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateKitchenRequest {
  name: string;
  code?: string;
  display_name?: string;
  type?: string;
  prep_type?: string;
  capacity_per_slot?: number;
  avg_prep_time_mins?: number;
  buffer_time_mins?: number;
  max_concurrent_orders?: number;
  priority?: number;
  supports_pickup?: boolean;
  supports_delivery?: boolean;
  supports_dine_in?: boolean;
  supports_scheduled_orders?: boolean;
  supports_instant_orders?: boolean;
  visible_to_customers?: boolean;
  internal_only?: boolean;
  kitchen_login_enabled?: boolean;
  require_pin_login?: boolean;
  device_restriction_enabled?: boolean;
}

export interface UpdateKitchenRequest extends Partial<CreateKitchenRequest> {
  status?: string;
}

const getAuthHeader = () => {
  const token = localStorage.getItem('dinevra_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const kitchensApi = {
  listByLocation: async (locationId: string) => {
    const response = await axios.get<{ kitchens: Kitchen[] }>(`${API_URL}/location-kitchens/${locationId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axios.get<Kitchen>(`${API_URL}/kitchens/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  create: async (locationId: string, data: CreateKitchenRequest) => {
    const response = await axios.post<Kitchen>(`${API_URL}/location-kitchens/${locationId}`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  update: async (id: string, data: UpdateKitchenRequest) => {
    const response = await axios.put<Kitchen>(`${API_URL}/kitchens/${id}`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axios.delete(`${API_URL}/kitchens/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};
