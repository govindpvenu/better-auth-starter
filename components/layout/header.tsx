import Link from "next/link";
import { Profile } from "./Profile";
import ThemeToggle from "./ThemeToggle";
import { GalleryVerticalEnd } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center border-b justify-between p-4 bg-background">
      <div className="flex justify-center gap-2 md:justify-start">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Better Auth Starter
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Profile />
      </div>
    </header>
  );
}
