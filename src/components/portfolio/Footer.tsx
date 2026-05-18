import { Signature } from "./Signature";

export function Footer() {
  return (
    <footer className="px-4 pb-10 pt-20 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-3xl border border-border bg-card p-8 sm:p-12">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">— With gratitude</p>
            <p className="mt-3 text-4xl font-bold tracking-[-0.02em] sm:text-6xl">thank you for being here.</p>
          </div>
          <div className="text-signature">
            <Signature className="h-16 w-48" />
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Jordan Riley — Graduation 2026</p>
          <p>Crestwood University · Computer Science</p>
        </div>
      </div>
    </footer>
  );
}
