import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "./ui/button";
import { LogInIcon, LogOutIcon, PlusIcon, UploadIcon } from "lucide-react";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Tooltip } from "./ui/tooltip";

const links = [
  { to: "/", label: "Home" },
  { to: "/favorites", label: "Favorites" },
  { to: "/my-components", label: "My Components" },
];

export default function Navbar() {
  const [auth, setAuth] = useState(true);

  return (
    <nav className="flex items-center justify-between px-12 py-6 border-b-2">
      <Link to="/">
        <h1 className="text-2xl font-bold">Best of v0</h1>
      </Link>
      {auth ? (
        <NavbarAuth handleSignOut={() => setAuth(false)} />
      ) : (
        <NavbarUnauth handleSignIn={() => setAuth(true)} />
      )}
    </nav>
  );
}

function NavbarAuth({ handleSignOut }: { handleSignOut: () => void }) {
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
      <Button variant="outline" onClick={handleSignOut}>
        <LogOutIcon className="w-4 h-4" /> Sign out
      </Button>
    </div>
  );
}

function NavbarUnauth({ handleSignIn }: { handleSignIn: () => void }) {
  return (
    <div>
      <Button variant="outline" onClick={handleSignIn}>
        <LogInIcon className="w-4 h-4 mr-2" />
        Sign in
      </Button>
    </div>
  );
}
