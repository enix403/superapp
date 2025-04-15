import { useLogin } from "@/hooks/useLogin";
import { apiConn } from "@/lib/api-routes";
import { delay } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "react-router";

export function OAuthSuccess() {
  const { token } = useParams();
  const loginApp = useLogin();

  const { data: user, isError } = useQuery({
    queryKey: ["attempOAuthLogin", token],
    queryFn: async () => {
      let res = await apiConn
        // IMPORTANT: make sure the url does not start with a slash
        .get("auth/me", {
          headers: {
            Authorization: `Bearer: ${token}`
          }
        })
        .json();
      console.log(res);
      return res;
    },
    staleTime: Infinity,
    retry: false
  });

  useEffect(() => {
    if (isError) {
      console.log("Invalid");
      return;
    }

    if (!user) {
      return;
    }

    loginApp(user, token);
  }, [user, isError, loginApp]);

  return <>{isError ? "Invalid Session" : "Loading..."}</>;
}
