import axiosInstance from "../../../shared/api/axiosInstance";

export const adminService = {
  // USERS
  getUsers: async (params: URLSearchParams) => {
    const res = await axiosInstance.get(
      "/api/v1/auth/admin/listUsers",
      {
        params: Object.fromEntries(params),
      }
    );
    return res.data;
  },

  activateUser: async (id: string) => {
    const res = await axiosInstance.patch(
      `/api/v1/auth/admin/activate/${id}`,
      {}
    );
    return res.data;
  },

  deactivateUser: async (id: string) => {
    const res = await axiosInstance.patch(
      `/api/v1/auth/admin/deactivate/${id}`,
      {}
    );
    return res.data;
  },

  deleteUser: async (id: string) => {
    const res = await axiosInstance.delete(
      `/api/v1/auth/admin/delete/${id}`
    );
    return res.data;
  },

  // INCIDENTS
  getIncidents: async (params: URLSearchParams) => {
    const res = await axiosInstance.get(
      "/api/v1/incidents/AdminIncidents",
      {
        params: Object.fromEntries(params),
      }
    );
    return res.data;
  },

  // OFFICERS
  createOfficer: async (formData: FormData) => {
    const res = await axiosInstance.post(
      "/api/v1/auth/admin/createOfficer",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  },
};