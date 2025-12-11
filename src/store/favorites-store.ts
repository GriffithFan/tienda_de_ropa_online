import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favorites: string[]; // Array of product slugs
  addFavorite: (slug: string) => void;
  removeFavorite: (slug: string) => void;
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
  clearFavorites: () => void;
  getFavoritesCount: () => number;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (slug: string) => {
        set((state) => ({
          favorites: state.favorites.includes(slug)
            ? state.favorites
            : [...state.favorites, slug],
        }));
      },

      removeFavorite: (slug: string) => {
        set((state) => ({
          favorites: state.favorites.filter((f) => f !== slug),
        }));
      },

      toggleFavorite: (slug: string) => {
        const { favorites } = get();
        if (favorites.includes(slug)) {
          set({ favorites: favorites.filter((f) => f !== slug) });
        } else {
          set({ favorites: [...favorites, slug] });
        }
      },

      isFavorite: (slug: string) => {
        return get().favorites.includes(slug);
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },

      getFavoritesCount: () => {
        return get().favorites.length;
      },
    }),
    {
      name: 'kuro-favorites',
    }
  )
);
