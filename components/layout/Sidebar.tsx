"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Bell, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "홈", icon: Home },
  { href: "/profile", label: "내 프로필", icon: User },
  { href: "/notifications", label: "알림", icon: Bell },
  { href: "/more", label: "더보기", icon: MoreHorizontal },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 lg:w-80 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-orange-500 mb-8">궁금닷컴</h1>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-full transition-colors",
                  isActive
                    ? "bg-orange-100 text-orange-500 font-medium"
                    : "text-gray-500 hover:bg-gray-50"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
