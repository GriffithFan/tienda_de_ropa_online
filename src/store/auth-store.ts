import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, Address } from '@/types';

/**
 * Interface del estado de autenticacion
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Acciones de autenticacion
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  
  // Gestion de perfil
  updateProfile: (data: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  
  // Recuperacion de contrasena
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

/**
 * Store de autenticacion con persistencia
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, _password: string) => {
        set({ isLoading: true });
        
        try {
          // Simulacion de llamada a API
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          const mockUser: User = {
            id: 'user-1',
            email,
            firstName: 'Usuario',
            lastName: 'Demo',
            phone: '+54 11 1234-5678',
            addresses: [],
            orders: [],
            createdAt: new Date().toISOString(),
          };
          
          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true });
        
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          const newUser: User = {
            id: `user-${Date.now()}`,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phone: userData.phone,
            addresses: [],
            orders: [],
            createdAt: new Date().toISOString(),
          };
          
          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      updateProfile: (data: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;
        
        set({
          user: { ...currentUser, ...data },
        });
      },

      addAddress: (address: Omit<Address, 'id'>) => {
        const currentUser = get().user;
        if (!currentUser) return;
        
        const newAddress: Address = {
          ...address,
          id: `address-${Date.now()}`,
        };
        
        const addresses = address.isDefault
          ? currentUser.addresses.map((a) => ({ ...a, isDefault: false }))
          : currentUser.addresses;
        
        set({
          user: {
            ...currentUser,
            addresses: [...addresses, newAddress],
          },
        });
      },

      removeAddress: (addressId: string) => {
        const currentUser = get().user;
        if (!currentUser) return;
        
        set({
          user: {
            ...currentUser,
            addresses: currentUser.addresses.filter((a) => a.id !== addressId),
          },
        });
      },

      setDefaultAddress: (addressId: string) => {
        const currentUser = get().user;
        if (!currentUser) return;
        
        set({
          user: {
            ...currentUser,
            addresses: currentUser.addresses.map((a) => ({
              ...a,
              isDefault: a.id === addressId,
            })),
          },
        });
      },

      requestPasswordReset: async (_email: string) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // En produccion, aqui se enviaria un email con el token
      },

      resetPassword: async (_token: string, _newPassword: string) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // En produccion, aqui se validaria el token y actualizaria la contrasena
      },
    }),
    {
      name: 'kuro-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
