import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { LogInIcon, LogOutIcon, PlusIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { SignedIn, SignedOut, SignInButton, useAuth, UserButton } from "@clerk/tanstack-start";

const links = [
  { to: "/", label: "Home" },
  { to: "/favorites", label: "Favorites" },
  { to: "/my-components", label: "My Components" },
];

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-12 py-6 border-b-2">
      <Link to="/">
        <h1 className="text-2xl font-bold">Best of v0</h1>
      </Link>

      <SignedIn>
        <NavbarAuth />
      </SignedIn>

      <SignedOut>
        <SignInButton>
          <Button variant="outline">
            <LogInIcon className="w-4 h-4 mr-2" />
            Sign in
          </Button>
        </SignInButton>
      </SignedOut>
    </nav>
  );
}

function NavbarAuth() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-6">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-md text-muted-foreground hover:text-foreground"
            activeProps={{
              className: "font-semibold text-primary",
            }}
            activeOptions={{ exact: true }}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="default">
              <PlusIcon className="w-4 h-4" />
              New
            </Button>
          </TooltipTrigger>
          <TooltipContent>Create a new component</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <UserButton
        appearance={{
          elements: {
            avatarBox: "w-9 h-9",
          },
        }}
      />
    </div>
  );
}
