import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const missingMsg = "Supabase environment variables not configured";

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      })
    : (() => {
        console.warn(missingMsg);
        return createClient("https://placeholder.supabase.co", "placeholder-anon-key");
      })();

export { supabase };

// NOTE: This client uses Supabase REST API (HTTPS) which routes through Supabase's edge network.
// For serverless/edge functions (Vercel, Netlify), use the Pooler connection string:
// postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true
// Direct connection (port 5432) should NOT be used in serverless environments.
