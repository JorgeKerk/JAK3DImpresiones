import { createClient } from "@supabase/supabase-js"

// Crear un cliente de Supabase para el lado del servidor
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
  return createClient(supabaseUrl, supabaseKey)
}

// Crear un cliente de Supabase para el lado del cliente
let clientSupabaseClient: ReturnType<typeof createClient> | null = null

export const createClientSupabaseClient = () => {
  if (clientSupabaseClient) return clientSupabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  clientSupabaseClient = createClient(supabaseUrl, supabaseKey)

  return clientSupabaseClient
}

