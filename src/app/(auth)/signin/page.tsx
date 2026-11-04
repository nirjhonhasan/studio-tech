import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register — StudioSpace",
};

// Registration page (requirement 3b): Name, Email, Photo URL, Password with
// live validation rules, Google social login, and a link to the login page.
export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join the marketplace where creators list, discover and book production studios."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
