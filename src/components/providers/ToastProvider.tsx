/** @format */

"use client";

import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      expand={true}
      richColors
      closeButton
      toastOptions={{
        style: {
          borderRadius: '20px',
          padding: '16px 24px',
          border: '1px solid rgba(236, 72, 153, 0.1)',
          boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1)',
          fontSize: '14px',
          fontWeight: '600'
        },
        className: "myola-toast",
      }}
    />
  );
}