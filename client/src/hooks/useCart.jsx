/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import useAxiosSecure from "./useAxiosSecure";

const useCart = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("access-token");
  const axios = useAxiosSecure();

  const {
    isLoading,
    data: cart = [],
    refetch,
    error,
  } = useQuery({
    queryKey: ["cart", user?.email],
    queryFn: async () => {
      const res = await axios(`/carts?email=${user?.email}`);
      return res.data;
    },
  });

  return [cart, isLoading, refetch, error];
};

export default useCart;
