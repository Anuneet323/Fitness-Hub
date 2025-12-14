// ============================================
// src/services/planService.js - Fitness Plans
// ============================================

import api from "./api";

export const planService = {
  // Get all plans with filters
  getPlans: async (params = {}) => {
    const response = await api.get("/plans", { params });
    return response.data;
  },

  // Get plan by ID
  getPlanById: async (id) => {
    const response = await api.get(`/plans/${id}`);
    return response.data;
  },

  // Create plan (trainer only)
  createPlan: async (planData) => {
    const response = await api.post("/plans", planData);
    return response.data;
  },

  // Update plan (trainer only)
  updatePlan: async (id, planData) => {
    const response = await api.put(`/plans/${id}`, planData);
    return response.data;
  },

  // Delete plan (trainer only)
  deletePlan: async (id) => {
    const response = await api.delete(`/plans/${id}`);
    return response.data;
  },

  // Get my plans (trainer only)
  getMyPlans: async () => {
    const response = await api.get("/plans/my-plans");
    return response.data;
  },

  // Search plans
  searchPlans: async (query) => {
    const response = await api.get("/plans", {
      params: { search: query },
    });
    return response.data;
  },
};
