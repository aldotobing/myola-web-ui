/** @format */

"use client";

import { useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContexts";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardIndex() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Role-based redirection
      switch (user.role) {
        case "admin":
          router.push("/dashboard/admin");
          break;
        case "sales":
          router.push("/dashboard/sales");
          break;
        case "member":
        default:
          router.push("/dashboard/profil");
          break;
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Mengarahkan ke dashboard Anda...</p>
      </div>
    </div>
  );
}
