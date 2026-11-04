"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  CirclePlus,
  Library,
  CalendarCheck,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuthUser, authClient } from "@/lib/auth-client";

/**
 * Avatar dropdown shown in the navbar when the user is logged in.
 * Reads the session via BetterAuth — no props needed.
 * Menu items match the requirement: Dashboard, Add New Studio,
 * My Studio Listings, My Bookings, Logout.
 */
export function UserMenu() {
  const router = useRouter();
  const { user } = useAuthUser();

  const initials = user?.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function handleLogout() {
    await authClient.signOut();
    toast.success("Logged out. See you at the next shoot!");
    router.push("/");
    router.refresh(); // re-render server components with the cleared cookie
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label="Open account menu"
      >
        {/* Show the profile photo when available, otherwise the initials */}
        {user?.image ? (
          <Image
            src={user.image}
            alt={user.name}
            width={36}
            height={36}
            className="size-9 rounded-full object-cover ring-2 ring-primary/40"
            unoptimized // remote avatar URLs (imgbb etc.) don't need Next's optimizer
          />
        ) : (
          <span className="flex size-9 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary ring-2 ring-primary/40">
            {initials}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* GroupLabel must live inside a Group in Base UI, otherwise the popup crashes */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5">
            <p className="text-sm font-semibold text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <MenuLink href="/dashboard" icon={<LayoutDashboard className="size-4" />}>
          Dashboard
        </MenuLink>
        <MenuLink href="/add-studio" icon={<CirclePlus className="size-4" />}>
          Add New Studio
        </MenuLink>
        <MenuLink href="/my-listings" icon={<Library className="size-4" />}>
          My Studio Listings
        </MenuLink>
        <MenuLink href="/my-bookings" icon={<CalendarCheck className="size-4" />}>
          My Bookings
        </MenuLink>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="size-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Small helper so each dropdown row reads as plain JSX. */
function MenuLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <DropdownMenuItem className="cursor-pointer" render={<Link href={href} />}>
      {icon}
      {children}
    </DropdownMenuItem>
  );
}
