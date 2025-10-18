"use client";


import useCartStore from "@/lib/store/Cart/Cart.store";
import CartButton from "./CartButton";



export default function CartCount() {
  const { cartCountValue } = useCartStore();

  return <CartButton cartCount={cartCountValue} />;
}
