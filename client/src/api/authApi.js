import axiosInstance from './axiosInstance';

const authApi = {
  login: (data) => axiosInstance.post('/auth/login', data),
  register: (data) => axiosInstance.post('/auth/register', data),
  logout: () => axiosInstance.post('/auth/logout'),
  getMe: () => axiosInstance.get('/auth/me'),
};

export default authApi;
