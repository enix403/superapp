import { createContext, PropsWithChildren, useContext } from "react";

export const RenderObjectsContext = createContext<any>(null);

export function RenderObjectsProvider({
  planComponents,
  children
}: { planComponents: any } & PropsWithChildren) {
  return (
    <RenderObjectsContext.Provider value={planComponents}>
      {children}
    </RenderObjectsContext.Provider>
  );
}

export function useRenderObjectComponents() {
  return useContext(RenderObjectsContext)!;
}
