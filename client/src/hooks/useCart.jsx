/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const useCart = (email) => {
  const { user } = useContext(AuthContext);
  const {
    isLoading,
    data: cart = [],
    refetch
  } = useQuery({
    queryKey: ["cart", user?.email],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:5000/carts?email=${user?.email}`
      );
      return res.json();
    },
  });

  return [cart, isLoading,refetch];
};
