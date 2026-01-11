"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Package,
  DollarSign,
  Calendar,
  Scan,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/lib/types/database.types";

import type { LucideIcon } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  allowedRoles: UserRole[];
}

const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    allowedRoles: ["front_desk", "coach", "admin"],
  },
  {
    name: "Members",
    href: "/admin/members",
    icon: Users,
    allowedRoles: ["front_desk", "coach", "admin"],
  },
  {
    name: "Memberships",
    href: "/admin/memberships",
    icon: CreditCard,
    allowedRoles: ["front_desk", "admin"],
  },
  {
    name: "Plans",
    href: "/admin/plans",
    icon: Package,
    allowedRoles: ["admin"],
  },
  {
    name: "Payments",
    href: "/admin/payments",
    icon: DollarSign,
    allowedRoles: ["front_desk", "admin"],
  },
  {
    name: "Classes",
    href: "/admin/classes",
    icon: Calendar,
    allowedRoles: ["coach", "admin"],
  },
  {
    name: "Devices",
    href: "/admin/devices",
    icon: Scan,
    allowedRoles: ["admin"],
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    allowedRoles: ["admin"],
  },
];

interface SidebarProps {
  userRole: UserRole | null;
  userName: string;
}

export function Sidebar({ userRole, userName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  const filteredNavigation = navigation.filter(
    (item) => userRole && item.allowedRoles.includes(userRole)
  );

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-slate-900">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-2xl font-bold text-white">F50 Gym</h1>
        </div>
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {filteredNavigation.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-white"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <div className="mb-3 text-sm">
            <div className="font-medium text-white">{userName}</div>
            <div className="text-slate-400 capitalize">
              {userRole?.replace("_", " ") || "Staff"}
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            size="sm"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
