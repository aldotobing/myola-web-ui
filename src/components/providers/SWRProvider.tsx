/** @format */

"use client";

import { SWRConfig } from "swr";

export default function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        shouldRetryOnError: true,
        errorRetryCount: 3,
        dedupingInterval: 5000, // 5 seconds
        loadingTimeout: 10000, // 10 seconds deadline
      }}
    >
      {children}
    </SWRConfig>
  );
}
