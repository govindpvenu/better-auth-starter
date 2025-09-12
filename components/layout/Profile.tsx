import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { User } from "lucide-react";
import Link from "next/link";
import { LogoutButton } from "./LogOut";

export async function Profile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log("session:", session);

  if (!session) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={session?.user?.image ?? undefined} />
          <AvatarFallback>
            {session?.user?.name[0]}
            {session?.user?.name[0]}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <div className="flex flex-col">
          <span className="mx-4 font-bold">{session?.user?.name}</span>
          <span className="mx-4 text-sm">{session?.user?.email}</span>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <Link href={"/profile"}>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>

          <LogoutButton />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
