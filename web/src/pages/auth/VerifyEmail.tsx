import { useLogin } from "@/hooks/useLogin";
import { apiRoutes } from "@/lib/api-routes";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "react-router";

export function VerifyEmail() {
  const { userId, token } = useParams();
  const loginApp = useLogin();

  const { data, isError } = useQuery({
    queryKey: ["verifyEmail", userId, token],
    queryFn: () => apiRoutes.verifyEmail({ userId, token }),
    staleTime: Infinity,
    retry: false
  });

  useEffect(() => {
    if (isError) {
      console.log("Invalid");
      return;
    }

    if (!data) {
      return;
    }

    const { user, accessToken } = data;
    loginApp(user, accessToken);
  }, [data, isError, loginApp]);

  return <>{isError ? "Invalid link" : "Loading..."}</>;
}
