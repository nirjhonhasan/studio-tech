"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Eye, EyeOff, LoaderCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthCard, AuthSwitchLink } from "@/components/auth/auth-layout";
import { authClient } from "@/lib/auth-client";

/**
 * Live password checklist — the requirement's three rules:
 * uppercase letter, lowercase letter, at least 6 characters.
 */
const PASSWORD_RULES = [
  { label: "An uppercase letter (A–Z)", test: (pw: string) => /[A-Z]/.test(pw) },
  { label: "A lowercase letter (a–z)", test: (pw: string) => /[a-z]/.test(pw) },
  { label: "At least 6 characters", test: (pw: string) => pw.length >= 6 },
];

/**
 * Registration page form — name, email, photo URL, password + Google login.
 * Invalid passwords are rejected inline (never sent to the server).
 */
export function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Enter a valid email address.";
    if (photoUrl.trim() && !/^https?:\/\/.+/.test(photoUrl.trim())) next.photoUrl = "Photo URL must start with http(s)://";
    const unmetRules = PASSWORD_RULES.filter((rule) => !rule.test(password));
    if (unmetRules.length > 0) {
      next.password = `Password needs ${unmetRules.map((rule) => rule.label.toLowerCase()).join(", ")}.`;
    }
    return next;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      toast.error("Please fix the highlighted fields first.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
      image: photoUrl.trim() || undefined, // optional
    });

    if (error) {
      toast.error(error.message ?? "Could not create your account. Please try again.");
      setIsSubmitting(false);
      return;
    }

    toast.success("Account created! Please log in to continue.");
    router.push("/login"); // requirement: send new users to the login page
  }

  async function handleGoogleSignup() {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/", // requirement: Google lands on the home page
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
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={handleGoogleSignup}
        disabled={isSubmitting}
        className="w-full gap-3 rounded-full text-base"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
          <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
          <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
        </svg>
        Continue with Google
      </Button>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or register with email
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Nadia Rahman"
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && <p className="text-xs font-medium text-destructive">{errors.name}</p>}
        </div>

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
          <Label htmlFor="photoUrl">Photo URL (optional)</Label>
          <Input
            id="photoUrl"
            type="url"
            value={photoUrl}
            onChange={(event) => setPhotoUrl(event.target.value)}
            placeholder="https://i.ibb.co/your-photo.jpg"
            aria-invalid={Boolean(errors.photoUrl)}
          />
          {errors.photoUrl && <p className="text-xs font-medium text-destructive">{errors.photoUrl}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
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

          {/* Live checklist — visible as soon as typing starts */}
          {password.length > 0 && (
            <ul className="mt-1 space-y-1">
              {PASSWORD_RULES.map((rule) => {
                const ok = rule.test(password);
                return (
                  <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${ok ? "text-emerald-500" : "text-muted-foreground"}`}>
                    {ok ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                    {rule.label}
                  </li>
                );
              })}
            </ul>
          )}
          {errors.password && <p className="text-xs font-medium text-destructive">{errors.password}</p>}
        </div>

        <Button type="submit" size="lg" disabled={isSubmitting} className="mt-1 gap-2 rounded-full">
          {isSubmitting ? (
            <>
              <LoaderCircle className="size-4 animate-spin" /> Creating account…
            </>
          ) : (
            "Register"
          )}
        </Button>
      </form>

      <div className="mt-5">
        <AuthSwitchLink text="Already have an account?" linkText="Login instead" href="/login" />
      </div>
    </AuthCard>
  );
}
