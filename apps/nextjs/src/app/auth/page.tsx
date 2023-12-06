import { AuthShowcase } from "../_components/auth-showcase";

export default function AuthPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      Sign in using your Google account
      <AuthShowcase />
    </div>
  );
}
