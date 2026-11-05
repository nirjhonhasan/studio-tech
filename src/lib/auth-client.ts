"use client";

import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";


export const authClient = createAuthClient({
  plugins: [
    jwtClient()
  ],
  
});

export const { signIn, signUp, useSession } = authClient;


export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

/**
 * Session hook used across the app (navbar, user menu, forms).
 * Returns `user: null` while loading and when signed out — check `isPending`
 * to tell those two apart.
 */
export function useAuthUser(): { user: AuthUser | null; isPending: boolean } {
  const { data, isPending } = useSession();

  if (isPending || !data?.user) return { user: null, isPending };

  return {
    user: {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      image: data.user.image ?? null,
    },
    isPending,
  };
}