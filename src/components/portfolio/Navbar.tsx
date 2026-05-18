import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-border bg-card/80 px-4 py-2 backdrop-blur-xl sm:px-6">
        <a href="#home" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-block h-2 w-2 rounded-full bg-signature" />
          studio<span className="text-muted-foreground">.folio</span>
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="#contact"
            className="hidden rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 md:inline-flex"
          >
            Hire me
          </a>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="mx-auto mt-2 max-w-7xl rounded-3xl border border-border bg-card p-4 md:hidden">
          <ul className="grid gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-sm hover:bg-accent"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
