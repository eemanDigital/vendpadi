import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

export const useCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.items);

  const cartTotal = useMemo(
    () => cartItems.reduce((s, i) => s + i.price * i.qty, 0),
    [cartItems],
  );

  const cartCount = useMemo(
    () => cartItems.reduce((s, i) => s + i.qty, 0),
    [cartItems],
  );

  return { cartItems, cartTotal, cartCount };
};

export default useCart;
