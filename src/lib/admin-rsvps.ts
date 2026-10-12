import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export interface AdminGuest {
  id: number;
  guest_name: string;
  relationship: string;
  attending_status: string;
  created_at: string;
}

export async function fetchAdminGuests(): Promise<AdminGuest[]> {
  const { data, error } = await supabase.rpc("get_admin_rsvps");
  if (error) throw error;
  return data ?? [];
}

export async function signInAdmin(username: string, password: string): Promise<Session> {
  if (username.trim() !== "admin") throw new Error("Đăng nhập không thành công.");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "admin@lhmq.invalid",
    password,
  });
  if (error || !data.session) throw error ?? new Error("Đăng nhập không thành công.");
  try {
    await fetchAdminGuests();
  } catch (cause) {
    await signOutAdmin();
    throw cause;
  }
  return data.session;
}

export async function signOutAdmin(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (cause) {
    // Memory-only auth: reload clears the client even when server revocation fails.
    location.reload();
    throw cause;
  }
}
