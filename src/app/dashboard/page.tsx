
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { authClient, useAuthUser } from "@/lib/auth-client";
import {
  LoaderCircle,
  CirclePlus,
  CalendarCheck,
  Compass,
  LogOut,
  Building2,
} from "lucide-react";
import type { Studio } from "@/types/studio";

const DashboardPage = () => {
  const router = useRouter();
  const { user, isPending } = useAuthUser();


  
  const [myStudios, setMyStudios] = useState<Studio[]>([]);

  useEffect(() => {
    if (!user?.email) return;
    fetch("/api/studios/mine")
      .then((res) => res.json())
      .then((data) => setMyStudios(Array.isArray(data) ? data : []))
      .catch(() => setMyStudios([]));
  }, [user?.email]);

  const handleSignOut = async () => {
    await authClient.signOut();
    toast.success("Signed out!");
    router.push("/");
    router.refresh();
  };

  const quickLinks = [
    {
      href: "/add-studio",
      icon: CirclePlus,
      label: "Add New Studio",
      desc: "List your space",
    },
    {
      href: "/my-bookings",
      icon: CalendarCheck,
      label: "My Bookings",
      desc: "Studios you host",
    },
    {
      href: "/studios",
      icon: Compass,
      label: "Explore Studios",
      desc: "Find your space",
    },
  ];


  
  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoaderCircle className="size-8 animate-spin text-primary" />
      </div>
    );
  }


  

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[60vh] px-4 text-center">
        <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
        <p className="max-w-sm text-muted-foreground">
          Please login to see your profile, studios and quick actions.
        </p>
        <Link
          href="/login"
          className="rounded-full bg-primary px-6 py-2.5 font-medium text-primary-foreground hover:opacity-90"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">



      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-5">



          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={80}
              height={80}
              className="size-20 rounded-full border-2 border-primary/40 object-cover"
            />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-full border-2 border-primary/40 bg-primary/10 text-3xl font-bold text-primary">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}




          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Welcome back
            </p>
            <h1 className="mt-1 truncate text-2xl font-bold">{user.name}</h1>
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
          </div>

          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500 hover:text-white"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      </div>




      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">My Studios</p>
              <p className="text-2xl font-bold">{myStudios.length}</p>
            </div>
          </div>
        </div>



        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CalendarCheck className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Latest listing</p>
              <p className="truncate text-lg font-semibold">
                {myStudios[0]?.title ?? "No studios yet"}
              </p>
            </div>
          </div>
        </div>
      </div>




      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          >
            <link.icon className="size-6 text-primary" />
            <p className="mt-3 font-semibold">{link.label}</p>
            <p className="mt-1 text-sm text-muted-foreground">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
