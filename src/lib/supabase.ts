import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Spec 002-login, regra 2: só a URL e a chave pública (anon). Nunca a service_role (rules/secrets.md).
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Sem configuração, o app mostra "Login não configurado" em vez de quebrar (CA-06).
export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null
