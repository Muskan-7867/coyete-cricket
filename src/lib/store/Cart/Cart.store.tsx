import { create } from "zustand";

type CartType = {
  cartCountValue: number;
  increaseCartCount: () => void;
  decreaseCartCount: () => void;
  setCartCount: (count: number) => void; // ✅ Add setter
};

const useCartStore = create<CartType>()((set) => ({
  cartCountValue: 0,
  increaseCartCount: () =>
    set((state) => ({ cartCountValue: state.cartCountValue + 1 })),
  decreaseCartCount: () =>
    set((state) => ({
      cartCountValue: state.cartCountValue > 0 ? state.cartCountValue - 1 : 0,
    })),
  setCartCount: (count) => set({ cartCountValue: count }),
}));

export default useCartStore;
