import { ModeToggle } from "../theme-toggle";

export default function Header() {
  return (
    <header className="flex border-b justify-end p-4">
      <ModeToggle />
    </header>
  );
}
