import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { signInAdmin, signOutAdmin, fetchAdminGuests } from "@/lib/admin-rsvps";

export function AdminPanel() {
  const [session, setSession] = useState<Session | null>(null);
  const [busy, setBusy] = useState<"login" | "export" | "logout" | null>(null);
  const [error, setError] = useState("");
  const mountedRef = useRef(false);
  const epochRef = useRef(0);
  const busyRef = useRef<typeof busy>(null);
  const sessionRef = useRef<Session | null>(null);
  const urlsRef = useRef(new Set<string>());

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;
    const urls = urlsRef.current;
    const epoch = epochRef.current;
    const { data } = supabase.auth.onAuthStateChange((_event, current) => {
      if (!current) {
        epochRef.current++;
        sessionRef.current = null;
        setSession(null);
        if (busyRef.current === "login") setError("Đăng nhập không thành công.");
        busyRef.current = null;
        setBusy(null);
      }
    });
    void supabase.auth
      .getSession()
      .then(async ({ data: current }) => {
        if (cancelled || !current.session || (current.session.expires_at ?? 0) * 1000 <= Date.now())
          return;
        await fetchAdminGuests();
        if (!cancelled && mountedRef.current && epoch === epochRef.current) {
          sessionRef.current = current.session;
          setSession(current.session);
        }
      })
      .catch(() => {
        if (mountedRef.current) setError("Vui lòng đăng nhập lại.");
      });
    return () => {
      mountedRef.current = false;
      cancelled = true;
      data.subscription.unsubscribe();
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  useEffect(() => {
    if (!session) return;
    const timer = window.setTimeout(
      () => {
        epochRef.current++;
        sessionRef.current = null;
        setSession(null);
        busyRef.current = null;
        setBusy(null);
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        void signOutAdmin().catch(() => {});
      },
      Math.max(0, (session.expires_at ?? 0) * 1000 - Date.now()),
    );
    return () => window.clearTimeout(timer);
  }, [session]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busyRef.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const epoch = ++epochRef.current;
    busyRef.current = "login";
    setBusy("login");
    setError("");
    try {
      const current = await signInAdmin(
        String(fields.get("username")),
        String(fields.get("password")),
      );
      if (!mountedRef.current || epoch !== epochRef.current) {
        await signOutAdmin();
        return;
      }
      sessionRef.current = current;
      setSession(current);
    } catch {
      if (mountedRef.current && epoch === epochRef.current) setError("Đăng nhập không thành công.");
    } finally {
      const password = form.elements.namedItem("password") as HTMLInputElement | null;
      if (password) password.value = "";
      if (mountedRef.current && epoch === epochRef.current) {
        busyRef.current = null;
        setBusy(null);
      }
    }
  }

  async function logout() {
    epochRef.current++;
    sessionRef.current = null;
    setSession(null);
    busyRef.current = "logout";
    setBusy("logout");
    setError("");
    try {
      await signOutAdmin();
    } catch {
      await supabase.auth.signOut({ scope: "local" });
      if (mountedRef.current)
        setError("Không thể kết thúc phiên trên máy chủ. Vui lòng thử lại khi có mạng.");
    } finally {
      if (mountedRef.current) {
        busyRef.current = null;
        setBusy(null);
      }
    }
  }

  async function download() {
    if (busyRef.current || !sessionRef.current) return;
    const epoch = epochRef.current;
    const canDownload = () =>
      mountedRef.current &&
      epoch === epochRef.current &&
      (sessionRef.current?.expires_at ?? 0) * 1000 > Date.now();
    if (!canDownload()) return;
    busyRef.current = "export";
    setBusy("export");
    setError("");
    try {
      const rows = await fetchAdminGuests();
      if (!canDownload()) return;
      const { buildAttendanceWorkbook } = await import("@/lib/attendance-export");
      const bytes = await buildAttendanceWorkbook(rows);
      if (!canDownload()) return;
      const url = URL.createObjectURL(
        new Blob([bytes], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      );
      urlsRef.current.add(url);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "danh-sach-tham-du.xlsx";
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => {
        URL.revokeObjectURL(url);
        urlsRef.current.delete(url);
      }, 1000);
    } catch {
      if (mountedRef.current && epoch === epochRef.current)
        setError("Không thể xuất Excel. Vui lòng thử lại.");
    } finally {
      if (mountedRef.current && epoch === epochRef.current) {
        busyRef.current = null;
        setBusy(null);
      }
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-12 text-foreground">
      <section className="w-full max-w-md rounded-3xl border border-border bg-card p-6 sm:p-8">
        <p className="text-xs uppercase tracking-widest text-signature">Minh Quân · Quản trị</p>
        <h1 className="mt-3 font-serif text-3xl leading-snug">Danh sách tham dự</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Thông tin riêng tư, chỉ dành cho chủ trang.
        </p>
        {session ? (
          <div className="mt-8 grid gap-3">
            <button
              type="button"
              onClick={download}
              disabled={busy !== null}
              className="min-h-12 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signature"
            >
              {busy === "export" ? "Đang xuất…" : "Tải Excel"}
            </button>
            <button
              type="button"
              onClick={logout}
              disabled={busy === "logout"}
              className="min-h-12 rounded-full border border-border px-6 py-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signature"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <form onSubmit={login} className="mt-8 grid gap-4">
            <div>
              <label htmlFor="admin-username" className="mb-2 block text-sm">
                Tên đăng nhập
              </label>
              <input
                id="admin-username"
                name="username"
                autoComplete="username"
                required
                maxLength={120}
                className="min-h-12 w-full rounded-xl border border-border bg-background px-4 text-base"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-2 block text-sm">
                Mật khẩu
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="min-h-12 w-full rounded-xl border border-border bg-background px-4 text-base"
              />
            </div>
            <button
              type="submit"
              disabled={busy !== null}
              className="min-h-12 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signature"
            >
              {busy === "login" ? "Đang đăng nhập…" : "Đăng nhập"}
            </button>
          </form>
        )}
        {error && (
          <p role="alert" className="mt-4 text-sm leading-relaxed text-red-700">
            {error}
          </p>
        )}
        <a
          href="/"
          className="mt-8 inline-block py-2 text-sm text-muted-foreground underline underline-offset-4"
        >
          Về trang chủ
        </a>
      </section>
    </main>
  );
}
