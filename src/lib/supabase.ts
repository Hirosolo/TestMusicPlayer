import { createClient } from "@supabase/supabase-js";

// For client-side (public access, read-only)
console.log("Loaded URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

// For server-side (safe inserts/updates/deletes)
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);
