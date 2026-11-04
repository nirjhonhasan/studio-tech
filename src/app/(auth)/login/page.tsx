import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login — StudioSpace",
};

// Login page (requirement 3a): Email, Password, Forgot Password, Login button,
// Google social login, and a link to the register page.
export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  // Private routes send users here as /login?redirect=/my-bookings etc.
  const redirectTo = typeof params.redirect === "string" ? params.redirect : "/";

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to book studios, manage your listings and keep your productions moving."
    >
      <LoginForm redirectTo={redirectTo} />
    </AuthLayout>
  );
}
