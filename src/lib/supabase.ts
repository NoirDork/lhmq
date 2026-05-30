import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const missingMsg = "Supabase environment variables not configured";
let supabase: ReturnType<typeof createClient>;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn(missingMsg);
  supabase = createClient(
    "https://placeholder.supabase.co",
    "placeholder-anon-key",
  );
}

export { supabase };
