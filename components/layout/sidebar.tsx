"use client";

import Link from "next/link";
import Image from "next/image";
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
import { useLanguage } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { UserRole } from "@/lib/types/database.types";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  nameKey: keyof typeof import("@/lib/i18n/translations").translations.tr.sidebar;
  href: string;
  icon: LucideIcon;
  allowedRoles: UserRole[];
}

const navigation: NavItem[] = [
  {
    nameKey: "dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    allowedRoles: ["front_desk", "coach", "admin"],
  },
  {
    nameKey: "members",
    href: "/admin/members",
    icon: Users,
    allowedRoles: ["front_desk", "coach", "admin"],
  },
  {
    nameKey: "memberships",
    href: "/admin/memberships",
    icon: CreditCard,
    allowedRoles: ["front_desk", "admin"],
  },
  {
    nameKey: "plans",
    href: "/admin/plans",
    icon: Package,
    allowedRoles: ["admin"],
  },
  {
    nameKey: "payments",
    href: "/admin/payments",
    icon: DollarSign,
    allowedRoles: ["front_desk", "admin"],
  },
  {
    nameKey: "classes",
    href: "/admin/classes",
    icon: Calendar,
    allowedRoles: ["coach", "admin"],
  },
  {
    nameKey: "devices",
    href: "/admin/devices",
    icon: Scan,
    allowedRoles: ["admin"],
  },
  {
    nameKey: "settings",
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
  const { t } = useLanguage();

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
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-brand-navy">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4 -ml-4">
          <Link href="/">
            <Image
              src="/f50-logo.png"
              alt="F50 Training"
              width={120}
              height={120}
              className="h-20 w-auto"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex-1 px-3 space-y-1">
          {filteredNavigation.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.nameKey}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2.5 text-base font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/25"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-white/50 group-hover:text-white"
                  )}
                />
                {t.sidebar[item.nameKey]}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-white/10 p-4 space-y-4">
          {/* Language Switcher */}
          <div className="flex justify-center">
            <LanguageSwitcher />
          </div>

          {/* User Info */}
          <div className="text-center">
            <div className="font-medium text-white text-base">{userName}</div>
            <div className="text-white/50 capitalize text-sm">
              {userRole?.replace("_", " ") || "Staff"}
            </div>
          </div>

          {/* Sign Out Button */}
          <Button
            variant="outline"
            className="w-full bg-transparent border-white/20 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/30"
            size="sm"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t.dashboard.signOut}
          </Button>
        </div>
      </div>
    </div>
  );
}
