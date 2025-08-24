import api from '@/lib/axios'; // Use our configured axios instance

export const loginUser = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
};



// ** NEW REGISTER FUNCTION **
// Make sure this function exists and is exported
export const registerUser = async (name, email, password) => {
  try {
    const { data } = await api.post('/auth/register', { name, email, password });
    return data;
  } catch (error) {
    // Re-throw a clean error message for the toast notification
    throw new Error(error.response?.data?.message || 'An unknown error occurred');
  }
};

export const getTasks = async () => {
  try {
    const { data } = await api.get('/tasks');
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
  }
};