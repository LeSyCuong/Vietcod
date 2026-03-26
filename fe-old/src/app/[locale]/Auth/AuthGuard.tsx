"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useUserStore } from "@/app/[locale]/stores/userStore";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, checkUser, isFetching, hasFetchedUser } = useUserStore();

  const isAdminRoute = pathname?.includes("/admin");

  useEffect(() => {
    if (!hasFetchedUser) {
      checkUser();
      window.addEventListener("storage", checkUser);
      return () => window.removeEventListener("storage", checkUser);
    }
  }, [checkUser, hasFetchedUser]);

  useEffect(() => {
    if (hasFetchedUser && !isFetching && !user) {
      router.push("/pages/login");
    }
  }, [user, router, isFetching, hasFetchedUser]);

  useEffect(() => {
    if (
      hasFetchedUser &&
      user &&
      isAdminRoute &&
      user.role?.toLowerCase() !== "admin"
    ) {
      router.push("/");
    }
  }, [user, router, isAdminRoute, hasFetchedUser]);

  if (isFetching || !hasFetchedUser) {
    return (
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black rounded-[15px] px-6 py-4 font-medium shadow-lg flex items-center gap-4 transition-all duration-300 ease-in-out text-center backdrop-blur-sm border border-gray-200 z-50">
        <div className="flex justify-center items-center p-5 text-gray-500 gap-2">
          <span className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full" />
          <span className="text-sm">Đang kiểm tra đăng nhập...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black rounded-[15px] px-6 py-4 font-medium shadow-lg flex items-center gap-4 transition-all duration-300 ease-in-out text-center backdrop-blur-sm border border-gray-200 z-50">
        <div className="flex justify-center items-center p-5 text-gray-500 gap-2">
          <span className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full" />
          <span className="text-sm">Đang chuyển hướng...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
