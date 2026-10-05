import { supabase } from "@/lib/supabase";

export interface PublicGuest {
  guest_name: string;
  attending_status: string;
  created_at: string;
}

interface RsvpSubmission {
  guestName: string;
  attendingStatus: string;
  email: string;
  message: string;
  relationship: string;
}

export async function submitRsvp({
  guestName,
  attendingStatus,
  email,
  message,
  relationship,
}: RsvpSubmission) {
  const { error } = await supabase.rpc("submit_rsvp", {
    p_guest_name: guestName,
    p_attending_status: attendingStatus,
    p_email: email,
    p_message: message,
    p_relationship: relationship,
  });

  if (error) throw error;
}

export async function fetchGuests(): Promise<PublicGuest[]> {
  const { data, error } = await supabase.rpc("get_public_rsvps");

  if (error) throw error;

  return data ?? [];
}
