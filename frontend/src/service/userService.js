import api from '@/lib/axios';

// Fetch all users (admin only)
export const getUsers = async () => {
  try {
    const { data } = await api.get('/users');
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};

// Create a new user (admin only)
export const createUser = async (userData) => {
  try {
    const { data } = await api.post('/users', userData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create user');
  }
};

// ** ADD THIS FUNCTION **
export const verifyPassword = async (currentPassword) => {
  try {
    const { data } = await api.post('/users/verify-password', { password: currentPassword });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Password verification failed');
  }
};

// Update a user (admin only)
export const updateUser = async (userId, userData) => {
    try {
        const { data } = await api.put(`/users/${userId}`, userData);
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update user');
    }
};

// ** THIS IS THE MISSING FUNCTION **
// Update the logged-in user's own profile
export const updateUserProfile = async (userData) => {
  try {
    const { data } = await api.put('/users/profile', userData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

// Delete a user (admin only)
export const deleteUser = async (userId) => {
    try {
        await api.delete(`/users/${userId}`);
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
};
