import { Profile } from "./Profile";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center border-b justify-between p-4 bg-background">
      <h1 className="text-2xl font-bold">Better Auth Starter</h1>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Profile />
      </div>
    </header>
  );
}
