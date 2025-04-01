import { PropsWithChildren } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

(window as any).toast = toast;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retryDelay: failureCount =>
        Math.min(Math.pow(2, failureCount) * 1000, 24000),
      retry: 3,
      networkMode: "always",
      staleTime: Infinity
    }
  }
});

(window as any).queryClient = queryClient;

export function Providers({ children }: PropsWithChildren) {
  return (
    <TooltipProvider delayDuration={0}>
      <QueryClientProvider client={queryClient}>
        <>{children}</>
        <Toaster />
      </QueryClientProvider>
    </TooltipProvider>
  );
}
