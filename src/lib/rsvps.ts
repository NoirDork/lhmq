import { supabase } from "@/lib/supabase";

export interface PublicGuest {
  id: number;
  guest_name: string;
  message: string;
  created_at: string;
  photo_url?: string;
}

interface RsvpSubmission {
  guestName: string;
  requestId: string;
  photo?: Blob;
  message: string;
  relationship: string;
}

export async function submitRsvp({
  guestName,
  requestId,
  photo,
  message,
  relationship,
}: RsvpSubmission) {
  const { data, error } = await supabase.rpc("begin_wish", {
    p_request_id: requestId,
    p_guest_name: guestName,
    p_message: message,
    p_relationship: relationship,
    p_has_photo: Boolean(photo),
  });

  if (error) throw error;
  if (data.published) return;
  if (photo && !data.photo_uploaded) {
    const { error: uploadError } = await supabase.storage
      .from("wish-photos")
      .upload(data.photo_path, photo, { contentType: "image/jpeg", upsert: false });
    if (uploadError) throw uploadError;
  }
  const { error: publishError } = await supabase.rpc("publish_wish", { p_request_id: requestId });
  if (publishError) throw publishError;
}

export async function fetchGuests(): Promise<PublicGuest[]> {
  const { data, error } = await supabase.rpc("get_wishes");

  if (error) throw error;

  return (data ?? []).map((guest: PublicGuest & { photo_path: string | null }) => ({
    ...guest,
    photo_url: guest.photo_path
      ? supabase.storage.from("wish-photos").getPublicUrl(guest.photo_path).data.publicUrl
      : undefined,
  }));
}
