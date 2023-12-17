/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useQuery } from "@tanstack/react-query";

const useUsers = () => {
  const {
    isLoading,
    data: users = [],
    refetch,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/users`);
      return res.json();
    },
  });

  return [users, isLoading, refetch, error];
};

export default useUsers;
