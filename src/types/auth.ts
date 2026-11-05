// Shared types for the logged-in user.
// Used by the navbar, user menu and forms.

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}
