import { afterEach, beforeEach, expect, it, vi } from "vitest";
const { rpc, signInWithPassword, signOut, reload } = vi.hoisted(() => ({
  rpc: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
  reload: vi.fn(),
}));
vi.mock("@/lib/supabase", () => ({ supabase: { rpc, auth: { signInWithPassword, signOut } } }));
import { signInAdmin, fetchAdminGuests, signOutAdmin } from "../admin-rsvps";
const session = { access_token: "fake-token", expires_at: 2000000000 };
beforeEach(() => {
  vi.resetAllMocks();
  vi.stubGlobal("location", { reload });
  signInWithPassword.mockResolvedValue({ data: { session }, error: null });
  signOut.mockResolvedValue({ error: null });
  rpc.mockResolvedValue({ data: [], error: null });
});
afterEach(() => vi.unstubAllGlobals());

it("uses Supabase password authentication and probes database permission", async () => {
  expect(await signInAdmin(" admin ", "test-only-password")).toBe(session);
  expect(signInWithPassword).toHaveBeenCalledWith({
    email: "admin@lhmq.invalid",
    password: "test-only-password",
  });
  expect(rpc).toHaveBeenCalledWith("get_admin_rsvps");
});
it("rejects an unexpected username without making an auth request", async () => {
  await expect(signInAdmin("guest", "test-only-password")).rejects.toThrow();
  expect(signInWithPassword).not.toHaveBeenCalled();
});
it("rejects a wrong password without an attendance request", async () => {
  signInWithPassword.mockResolvedValue({
    data: { session: null },
    error: new Error("Invalid login"),
  });
  await expect(signInAdmin("admin", "wrong-password")).rejects.toThrow();
  expect(rpc).not.toHaveBeenCalled();
});
it("rejects a missing session", async () => {
  signInWithPassword.mockResolvedValue({ data: { session: null }, error: null });
  await expect(signInAdmin("admin", "test-only-password")).rejects.toThrow();
});
it("signs out an authenticated user who has no database authorization", async () => {
  const error = { code: "42501" };
  rpc.mockResolvedValue({ error });
  await expect(signInAdmin("admin", "test-only-password")).rejects.toBe(error);
  expect(signOut).toHaveBeenCalled();
});
it("does not turn a denied export into an empty list", async () => {
  const error = { code: "42501" };
  rpc.mockResolvedValue({ error });
  await expect(fetchAdminGuests()).rejects.toBe(error);
});
it("propagates logout failure", async () => {
  signOut.mockResolvedValue({ error: new Error("Network") });
  await expect(signOutAdmin()).rejects.toThrow("Network");
  expect(reload).toHaveBeenCalledTimes(1);
});

it("drops the in-memory document when rejected-login cleanup cannot reach the server", async () => {
  rpc.mockResolvedValue({ error: { code: "42501" } });
  signOut.mockResolvedValue({ error: new Error("Network") });
  await expect(signInAdmin("admin", "test-only-password")).rejects.toMatchObject({
    message: "Network",
  });
  expect(reload).toHaveBeenCalledTimes(1);
});
