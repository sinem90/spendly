import api from './api';

export const transactionService = {
  async getAll(filters = {}) {
    const response = await api.get('/transactions', { params: filters });
    return response.data;
  },

  async getStats(startDate, endDate) {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await api.get('/transactions/stats', { params });
    return response.data;
  },

  async getTrends(months = 6) {
    const response = await api.get('/transactions/trends', { params: { months } });
    return response.data.trends;
  },

  async getById(id) {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  async create(transactionData) {
    const response = await api.post('/transactions', transactionData);
    return response.data.transaction;
  },

  async update(id, transactionData) {
    const response = await api.put(`/transactions/${id}`, transactionData);
    return response.data.transaction;
  },

  async delete(id) {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },
};
