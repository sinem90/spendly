import api from './api';

export const budgetService = {
  async getAll(filters = {}) {
    const response = await api.get('/budgets', { params: filters });
    return response.data.budgets;
  },

  async getActive() {
    const response = await api.get('/budgets/active');
    return response.data.budgets;
  },

  async getStatus() {
    const response = await api.get('/budgets/status');
    return response.data.budgets;
  },

  async getById(id) {
    const response = await api.get(`/budgets/${id}`);
    return response.data;
  },

  async create(budgetData) {
    const response = await api.post('/budgets', budgetData);
    return response.data.budget;
  },

  async update(id, budgetData) {
    const response = await api.put(`/budgets/${id}`, budgetData);
    return response.data.budget;
  },

  async delete(id) {
    const response = await api.delete(`/budgets/${id}`);
    return response.data;
  },
};
