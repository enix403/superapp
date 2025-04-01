import { useSetAuthState } from "@/stores/auth-store";
import { useCallback } from "react";
import { useNavigate } from "react-router";

export function useLogin() {
  const setAuthState = useSetAuthState();
  const navigate = useNavigate();

  return useCallback((user, accessToken) => {
    // TODO: should validate user ?
    setAuthState({
      token: accessToken,
      userId: user["_id"],
      userRole: user["role"]
    });
    navigate("/app");
  }, []);
}
