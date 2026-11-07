import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useUserAuth = () => {
  const { user, updateUser, clearUser, loading } = useContext(AuthContext);
  return { user, updateUser, clearUser, loading };
};
