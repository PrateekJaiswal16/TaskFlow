import { create } from 'zustand';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
  requestStatusChange,
} from '@/service/taskService';
import { toast } from 'sonner';

export const useTaskStore = create((set, get) => ({
  items: [],
  selectedTask: null,
  loading: false,
  pagination: { page: 1, pages: 1, total: 0 },

  fetchTasks: async (params = {}) => {
    set({ loading: true });
    try {
      const data = await getTasks(params);
      set({ 
        items: data.tasks,
        pagination: {
          page: data.page,
          pages: data.pages,
          total: data.total,
        },
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchTaskById: async (id) => {
    set({ loading: true, selectedTask: null });
    try {
      const task = await getTaskById(id);
      set({ selectedTask: task });
    } finally {
      set({ loading: false });
    }
  },

  createTask: async (formData) => {
    try {
      const newTask = await createTask(formData);
      get().fetchTasks({ page: 1 }); 
      return newTask;
    } catch (error) {
      console.error(error);
    }
  },

  updateTask: async (id, formData) => {
    try {
      const updatedTask = await updateTask(id, formData);
      set({
        items: get().items.map((t) => (t._id === id ? updatedTask : t)),
        selectedTask: updatedTask,
      });
      return updatedTask;
    } catch (error) {
      console.error(error);
    }
  },

  deleteTask: async (id) => {
    try {
      await deleteTask(id);
      get().fetchTasks({ page: get().pagination.page });
    } catch (error) {
      console.error(error);
    }
  },

  requestStatusChange: async (id) => {
    try {
      const updatedTask = await requestStatusChange(id);
      set({
        items: get().items.map((t) => (t._id === id ? updatedTask : t)),
        selectedTask: updatedTask,
      });
    } catch (error) {
      console.error(error);
    }
  },
  
  approveTask: async (id) => {
    try {
      const formData = new FormData();
      formData.append('status', 'Done');
      
      const updatedTask = await updateTask(id, formData);
      set({
        items: get().items.map((t) => (t._id === id ? updatedTask : t)),
        selectedTask: updatedTask,
      });
      toast.success('Task has been approved and marked as Done.');
    } catch (error) {
      console.error(error);
    }
  },
}));