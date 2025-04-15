import { useClearAuthState } from "@/stores/auth-store";
import { useLayoutEffect } from "react";
import { Navigate, useNavigate } from "react-router";

export function LogoutHandler() {
  const clearAuthState = useClearAuthState();

  useLayoutEffect(() => {
    clearAuthState();
  }, []);

  return <Navigate to="/" replace />
}