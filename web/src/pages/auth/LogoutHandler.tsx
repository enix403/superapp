import { useClearAuthState } from "@/stores/auth-store";
import { useLayoutEffect } from "react";
import { useNavigate } from "react-router";

export function LogoutHandler() {
  const clearAuthState = useClearAuthState();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    clearAuthState();
    navigate("/");
  }, []);

  return null;
}