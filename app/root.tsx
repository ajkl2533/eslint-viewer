import type { LinksFunction } from "@remix-run/node";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { UploadIcon } from "lucide-react";
import { Button } from "./components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./components/ui/navigation-menu";
import stylesheet from "./tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex min-h-screen w-full flex-col">
          <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 justify-between">
            <NavigationMenu>
              <NavigationMenuList>
                <Link to="/" className={navigationMenuTriggerStyle()}>
                  ESLint&nbsp;Viewer
                </Link>
                <Link to="/files" className={navigationMenuTriggerStyle()}>
                  Files
                </Link>
                <Link to="/rules" className={navigationMenuTriggerStyle()}>
                  Rules
                </Link>
              </NavigationMenuList>
            </NavigationMenu>
            <Button>
              <UploadIcon className="w-4 h-4 mr-2" /> Upload report
            </Button>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            {children}
          </main>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
