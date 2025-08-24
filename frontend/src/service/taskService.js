import api from '@/lib/axios';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore'; // 1. Import the auth store

export const getTasks = async (params = {}) => {
  try {
    // 2. Get the current user's role from the auth store
    const userRole = useAuthStore.getState().user?.role;

    // 3. Decide which URL to use based on the user's role
    const url = userRole === 'admin' ? '/tasks/admin/all' : '/tasks';

    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== '' && v != null)
    );
    
    // 4. Make the request to the correct, role-specific URL
    const { data } = await api.get(url, { params: cleanParams });
    return data;
  } catch (e) {
    toast.error('Failed to load tasks');
    throw e;
  }
};

// --- ALL OTHER FUNCTIONS REMAIN THE SAME ---

export const getTaskById = async (id) => {
  try {
    const { data } = await api.get(`/tasks/${id}`);
    return data;
  } catch (e) {
    toast.error('Failed to load task details');
    throw e;
  }
};

export const createTask = async (formData) => {
  try {
    const { data } = await api.post('/tasks', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    toast.success('Task created successfully!');
    return data;
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to create task');
    throw e;
  }
};

export const updateTask = async (id, formData) => {
  try {
    const { data } = await api.put(`/tasks/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    toast.success('Task updated successfully!');
    return data;
  } catch (e) {
    toast.error(e.response?.data?.message || 'Failed to update task');
    throw e;
  }
};

export const deleteTask = async (id) => {
  try {
    await api.delete(`/tasks/${id}`);
    toast.success('Task deleted successfully!');
  } catch (e) {
    toast.error('Failed to delete task');
    throw e;
  }
};

export const requestStatusChange = async (id) => {
    try {
        const { data } = await api.patch(`/tasks/${id}/request-change`);
        toast.success('Status change requested!');
        return data;
    } catch (e) {
        toast.error(e.response?.data?.message || 'Failed to request status change');
        throw e;
    }
};