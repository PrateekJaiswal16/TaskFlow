// src/store/useAuthStore.js
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { toast } from 'sonner';
import { updateUserProfile } from '@/service/userService';

const API_URL = 'http://localhost:8000/api'
const isJwtValid = (token) => {
  try {
    const [, payload] = token.split('.')
    const { exp } = JSON.parse(atob(payload))
    return typeof exp === 'number' ? Date.now() < exp * 1000 : false
  } catch { return false }
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      loading: false,
      isAuthenticated: false,
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      hydrate: () => {
        const token = get().token
        if (token && isJwtValid(token)) {
          set({ isAuthenticated: true })
        } else {
          set({ token: null, user: null, isAuthenticated: false })
        }
      },

      login: async (email, password) => {
        set({ loading: true });
        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({ message: 'Invalid credentials' }));
            throw new Error(err.message || 'Login failed');
          }

          const data = await res.json(); // Get the entire flat response object

          // Manually construct the user object from the flat data
          const user = {
            _id: data._id,
            name: data.name,
            email: data.email,
            role: data.role,
          };
          
          const token = data.token;

          // Set the state with the correctly structured data
          set({ token, user, isAuthenticated: true, loading: false });

        } catch (e) {
          set({ loading: false });
          throw e;
        }
      },

      register: async (name, email, password) => {
        set({ loading: true })
        try {
          const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
          })
          if (!res.ok) {
            const err = await res.json().catch(() => ({ message: 'Registration failed' }))
            throw new Error(err.message || 'Registration failed')
          }
          // On successful registration, we don't log the user in, just stop loading.
          set({ loading: false })
        } catch (e) {
          set({ loading: false })
          throw e
        }
      },

      // ** ADD THIS ACTION **
      updateProfile: async (userData) => {
        set({ loading: true });
        try {
          const updatedUser = await updateUserProfile(userData);
          set({ user: updatedUser, loading: false }); // Update the user object in the store
          toast.success('Profile updated successfully!');
        } catch (error) {
          set({ loading: false });
          toast.error(error.message);
          throw error;
        }
      },


      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user, // This was the missing piece
        isAuthenticated: state.isAuthenticated 
      }),
      // After persist rehydrates, recompute isAuthenticated from token
      onRehydrateStorage: () => (state, error) => {
        if (error) return;
        state.hydrate?.();
        state.setHasHydrated(true);
      },
    }
  )
)
