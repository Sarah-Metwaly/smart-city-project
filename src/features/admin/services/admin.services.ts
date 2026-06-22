import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

// const getAuthHeader = () => {
//   const token = localStorage.getItem("accessToken");
//   return { Authorization: `Bearer ${token}` };
// };

const getAuthHeader = () => {
  return {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWVlYTljYzM5MTUwODA1ODBjNjk0NGIiLCJpYXQiOjE3ODIxMzk2NzYsImV4cCI6MTc4MjE0MDU3Nn0.IOkBobgUJtkcfmMPj4SzhY_ZMA4-QNqUAyCJ-hSaEMQ`,
  };
};

export const adminService = {
  //Users
  getUsers: async (params: URLSearchParams) => {
    return axios.get(
      `${API_BASE}/api/v1/auth/admin/listUsers?${params.toString()}`,
      {
        headers: getAuthHeader(),
      },
    );
  },

  activateUser: async (id: string) => {
    return axios.patch(
      `${API_BASE}/api/v1/auth/admin/activate/${id}`,
      {},
      { headers: getAuthHeader() },
    );
  },

  deactivateUser: async (id: string) => {
    return axios.patch(
      `${API_BASE}/api/v1/auth/admin/deactivate/${id}`,
      {},
      { headers: getAuthHeader() },
    );
  },

  deleteUser: async (id: string) => {
    return axios.delete(`${API_BASE}/api/v1/auth/admin/delete/${id}`, {
      headers: getAuthHeader(),
    });
  },

  //Incidents
  getIncidents: async (params: URLSearchParams) => {
    return axios.get(
      `${API_BASE}/api/v1/incidents/AdminIncidents?${params.toString()}`,
      {
        headers: getAuthHeader(),
      },
    );
  },

  //Officers
  createOfficer: async (formData: FormData) => {
    return axios.post(`${API_BASE}/api/v1/auth/admin/createOfficer`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
