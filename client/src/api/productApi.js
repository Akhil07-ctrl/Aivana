import axiosInstance from './axiosInstance';

const productApi = {
  // Get all products with optional filters
  getProducts: (params) => axiosInstance.get('/products', { params }),

  // Get trending/featured products (explicitly marked as isTrending)
  getTrendingProducts: (limit = 4) => 
    axiosInstance.get('/products/trending', { 
      params: { limit } 
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
