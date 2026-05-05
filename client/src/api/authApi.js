import axiosInstance from './axiosInstance';

const authApi = {
  login: (data) => axiosInstance.post('/auth/login', data),
  register: (data) => axiosInstance.post('/auth/register', data),
  logout: () => axiosInstance.post('/auth/logout'),
  getMe: () => axiosInstance.get('/auth/me'),
  forgotPassword: (data) => axiosInstance.post('/auth/forgot-password', data),
  resetPassword: (data) => axiosInstance.post('/auth/reset-password', data),
  firebaseLogin: (data) => axiosInstance.post('/auth/firebase-login', data),
  linkPhone: (data) => axiosInstance.post('/auth/link-phone', data),
};

export default authApi;
