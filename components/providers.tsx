"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { useState } from "react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  // useState initializer — NOT module-level — prevents shared state between SSR requests
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000, retry: 1 },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast:
                "!bg-surface-container-lowest !border-outline-variant/20 !text-foreground !rounded-xl",
              title: "!font-medium",
              success: "!text-tertiary-fixed-dim",
              error: "!text-destructive",
            },
          }}
        />
      </MotionConfig>
    </QueryClientProvider>
  );
}
