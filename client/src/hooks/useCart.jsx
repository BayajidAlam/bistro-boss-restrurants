/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useCart = () => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem("access-token");
  const axios = useAxiosSecure();

  const {
    isLoading,
    data: cart = [],
    refetch,
    error,
  } = useQuery({
    queryKey: ["cart", user?.email],
    enabled: !loading,
    queryFn: async () => {
      const res = await axios(`/carts?email=${user?.email}`);
      return res.data;
    },
  });

  return [cart, isLoading, refetch, error];
};

export default useCart;
