import { create } from 'zustand';
import { getUsers, createUser, updateUser, deleteUser } from '@/service/userService'; // Corrected path
import { toast } from 'sonner';

export const useUserStore = create((set, get) => ({
  // STATE
  users: [],
  isLoading: false,
  error: null,

  // ACTIONS
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await getUsers();
      set({ users, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      toast.error(error.message);
    }
  },

  addUser: async (userData) => {
    try {
      const newUser = await createUser(userData);
      set((state) => ({ users: [newUser, ...state.users] }));
      toast.success('User created successfully!');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  },
  
  editUser: async (userId, userData) => {
    try {
      const updatedUser = await updateUser(userId, userData);
      set((state) => ({
        users: state.users.map(user => user._id === userId ? updatedUser : user)
      }));
      toast.success('User updated successfully!');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  },

  removeUser: async (userId) => {
    try {
      await deleteUser(userId);
      set((state) => ({
        users: state.users.filter(user => user._id !== userId)
      }));
      toast.success('User deleted successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  },
}));