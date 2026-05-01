import axiosInstance from './axiosInstance';

const productApi = {
  // Get all products with optional filters
  getProducts: (params) => axiosInstance.get('/products', { params }),

  // Get trending/featured products (limit to 4 or custom limit)
  getTrendingProducts: (limit = 4) => 
    axiosInstance.get('/products', { 
      params: { limit, sort: 'createdAt' } 
    }),

  // Get product by ID or slug
  getProductById: (identifier) => axiosInstance.get(`/products/${identifier}`),

  // Create product (requires API key - backend only)
  createProduct: (data) => axiosInstance.post('/products', data),

  // Update product (requires API key - backend only)
  updateProduct: (id, data) => axiosInstance.put(`/products/${id}`, data),

  // Delete product (requires API key - backend only)
  deleteProduct: (id) => axiosInstance.delete(`/products/${id}`),
};

export default productApi;
