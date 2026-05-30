import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const links = [
  { href: "#home", label: "Trang chủ" },
  { href: "#invitation", label: "Lời Mời" },
  { href: "#details", label: "Chi Tiết" },
  { href: "#memories", label: "Kỷ Niệm" },
  { href: "#rsvp", label: "RSVP" },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: easeOut }}
      className="fixed inset-x-0 top-4 z-50 mx-auto max-w-[calc(100vw-2rem)] sm:max-w-none sm:inset-x-6"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-border bg-card/80 px-4 py-2 backdrop-blur-xl sm:px-6">
        <motion.a
          href="#home"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 24 }}
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <motion.span
            className="inline-block h-2 w-2 rounded-full bg-signature"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: [1, 1.25, 1], opacity: [1, 0.75, 1] }}
            transition={{ duration: 2.4, repeat: 2, ease: "easeInOut" }}
          />
          grad<span className="text-muted-foreground">·2026</span>
        </motion.a>
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <motion.a
                href={l.href}
                whileHover="hover"
                initial="rest"
                animate="rest"
                className="relative inline-block rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <motion.span
                  variants={{
                    rest: { opacity: 0, scale: 0.9 },
                    hover: { opacity: 1, scale: 1 },
                  }}
                  transition={{ duration: 0.25, ease: easeOut }}
                  className="absolute inset-0 rounded-full bg-accent"
                  aria-hidden
                />
                <span className="relative">{l.label}</span>
              </motion.a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <motion.a
            href="#rsvp"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="hidden rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 md:inline-flex"
          >
            Gửi Lời Chúc
          </motion.a>
          <motion.button
            whileTap={{ scale: 0.92 }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2, ease: easeOut }}
                className="inline-flex"
              >
                {open ? <X size={16} /> : <Menu size={16} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.28, ease: easeOut }}
            className="mx-auto mt-2 max-w-7xl overflow-hidden md:hidden"
          >
            <motion.ul
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
              }}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="grid gap-1 rounded-3xl border border-border bg-card p-4"
            >
              {links.map((l) => (
                <motion.li
                  key={l.href}
                  variants={{
                    hidden: { opacity: 0, x: -8 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: easeOut } },
                  }}
                >
                  <motion.a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 24 }}
                    className="block rounded-2xl px-4 py-3 text-sm hover:bg-accent"
                  >
                    {l.label}
                  </motion.a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
