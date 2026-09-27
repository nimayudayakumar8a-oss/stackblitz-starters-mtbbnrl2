import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mozbprxoukvxblsqdolz.supabase.co";
const supabaseKey = "\sb_publishable__TLbOI8zyPF2MjeWJ7S9xw_bE8aKY-h";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);