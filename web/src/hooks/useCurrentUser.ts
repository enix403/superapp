import { useAuthState } from "@/stores/auth-store";
import { skipToken, useQuery } from "@tanstack/react-query";
import { delay } from "@/lib/utils";
import { apiRoutes } from "@/lib/api-routes";

/* export async function getMe({ token }) {
  await delay(2500);

  return {
    id: "1",
    name: "Hello",
    role: "user",
    age: 34
  };
} */

export function useCurrentUser() {
  const { token } = useAuthState();

  const { data: user, ...rest } = useQuery({
    queryKey: ["me", token],
    queryFn: token ? apiRoutes.getMe : skipToken,
    staleTime: Infinity
  });

  return { user, ...rest };
}
