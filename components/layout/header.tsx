import { ModeToggle } from "../theme-toggle";
import { LogoutButton } from "./LogOut";

export default function Header() {
  return (
    <header className="flex border-b justify-end p-4">
      <ModeToggle />
      <LogoutButton />
    </header>
  );
}
