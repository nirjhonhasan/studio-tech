"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthCard, AuthSwitchLink } from "@/components/auth/auth-layout";
import { authClient } from "@/lib/auth-client";



export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Enter a valid email address.";
    if (password.length === 0) next.password = "Enter your password.";
    return next;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setIsSubmitting(true);
    const { error } = await authClient.signIn.email({
      email: email.trim(),
      password,
    });

    if (error) {
      toast.error(error.message ?? "Invalid email or password.");
      setIsSubmitting(false);
      return;
    }

    toast.success("Welcome back! Your studio is waiting.");
    router.push(redirectTo); // desired route, or Home
    router.refresh();
  }

  /** Redirects to Google's consent screen; no toast on success (page navigates away). */
  async function handleGoogleLogin() {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: redirectTo,
    });
    if (error) {
      toast.error(
        error.message === "Social provider is not supported or not configured"
          ? "Google sign-in isn't configured yet."
          : error.message ?? "Google sign-in failed. Please try again."
      );
    }
  }

  return (
    <AuthCard>
      {/* Social login first — one tap beats typing */}
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={handleGoogleLogin}
        disabled={isSubmitting}
        className="w-full gap-3 rounded-full text-base"
      >
        <FcGoogle className="size-4" />
        Continue with Google
      </Button>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or log in with email
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <p className="text-xs font-medium text-destructive">{errors.email}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {/* UI only — the requirement says not to implement actual reset flows */}
            <button
              type="button"
              onClick={() =>
                toast.info("Password reset is coming soon — contact support@studiospace.app meanwhile.")
              }
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="pr-10"
              aria-invalid={Boolean(errors.password)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs font-medium text-destructive">{errors.password}</p>}
        </div>

        <Button type="submit" size="lg" disabled={isSubmitting} className="mt-1 gap-2 rounded-full">
          {isSubmitting ? (
            <>
              <LoaderCircle className="size-4 animate-spin" /> Logging in…
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>

      <div className="mt-5">
        <AuthSwitchLink text="New to StudioSpace?" linkText="Create an account" href="/signin" />
      </div>
    </AuthCard>
  );
}
