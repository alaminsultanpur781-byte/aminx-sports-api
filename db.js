const { createClient } = require("@supabase/supabase-js");

const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : null;

function requireDb() {
  if (!supabase) {
    const error = new Error("Database is not configured. Set Supabase environment variables.");
    error.status = 503;
    throw error;
  }
  return supabase;
}

module.exports = { supabase, requireDb };
