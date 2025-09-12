import { ModeToggle } from "../theme-toggle";
import { Profile } from "./Profile";

export default function Header() {
  return (
    <header className="flex items-center border-b justify-between p-4">
      <h1 className="text-2xl font-bold">Better Auth Starter</h1>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <Profile />
      </div>
    </header>
  );
}
