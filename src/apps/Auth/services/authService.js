import apiClient from '../../../config/api';

const authService = {
  // Sign up a new user
  signup: async (email, password, name, role="user") => {
    try {
      const response = await apiClient.post('/user/signup', {
        email,
        password,
        name,
        role,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Signup failed' };
    }
  },

  // Verify email with OTP
  verifyEmail: async (email, otp) => {
    try {
      const response = await apiClient.post('/user/verify-email', {
        email,
        otp,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Email verification failed' };
    }
  },

  // Login user (backend sets JWT cookie)
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/user/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Request password reset
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post('/user/forgot-password', {
        email,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password reset request failed' };
    }
  },

  // Verify OTP for password reset
  verifyOTP: async (email, otp) => {
    try {
      const response = await apiClient.post('/user/verify-otp', {
        email,
        otp,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'OTP verification failed' };
    }
  },

  // Update password with reset token
  updatePassword: async (resetToken, newPassword) => {
    try {
      const response = await apiClient.post('/user/update-password', {
        resetToken,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password update failed' };
    }
  },

  // Logout user (clears cookie on backend)
  logout: async () => {
    try {
      const response = await apiClient.post('/user/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Logout failed' };
    }
  },

  // Check auth status
  checkAuth: async () => {
    try {
      const response = await apiClient.get('/user/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Not authenticated' };
    }
  },
};

export default authService;
