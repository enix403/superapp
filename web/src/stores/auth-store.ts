import { getDefaultStore, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage, RESET } from "jotai/utils";

export type AuthState = {
  token: string;
  userId: string;
  userRole: string;
};

const PERSISTANT_STORE_NAME = "authStateData";

export const stateAtom = atomWithStorage<AuthState>(
  PERSISTANT_STORE_NAME,
  {
    token: "",
    userId: "",
    userRole: ""
  },
  undefined,
  { getOnInit: true }
);

(window as any).defStore = getDefaultStore();
(window as any).stateAtom = stateAtom;

export function getAuthState() {
  const store = getDefaultStore();
  return store.get(stateAtom);
}

export function useAuthState() {
  return useAtomValue(stateAtom);
}

export function useSetAuthState() {
  return useSetAtom(stateAtom);
}

export function useClearAuthState() {
  const setState = useSetAtom(stateAtom);
  return () => setState(RESET);
}
