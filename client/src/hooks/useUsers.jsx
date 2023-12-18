/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useUsers = () => {
  const axiosSecure  = useAxiosSecure();

  const {
    isLoading,
    data: users = [],
    refetch,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure(`/users`);
      return res.data;
    },
  });

  return [users, isLoading, refetch, error];
};

export default useUsers;
