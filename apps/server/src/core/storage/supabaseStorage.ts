import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";

let client: SupabaseClient | null | undefined;

/** Cliente de Supabase con la secret key; null si no está configurado (ver .env.example). */
function getClient(): SupabaseClient | null {
  if (client !== undefined) return client;
  client = env.SUPABASE_URL && env.SUPABASE_SECRET_KEY
    ? createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } })
    : null;
  return client;
}

const PUBLIC_URL_MARKER = "/object/public/";

/** Sube el archivo (ya procesado) al bucket de avatares y devuelve su URL pública. */
export async function uploadAvatar(userId: bigint, buffer: Buffer, contentType: string, extension: string): Promise<string> {
  const supabase = getClient();
  if (!supabase) throw { status: 500, code: "STORAGE_NOT_CONFIGURED", message: "La foto de perfil no está disponible: falta configurar Supabase Storage" };

  const path = `${userId}/${Date.now()}.${extension}`;
  const { error } = await supabase.storage.from(env.SUPABASE_BUCKET).upload(path, buffer, { contentType, upsert: false });
  if (error) throw { status: 502, code: "STORAGE_UPLOAD_FAILED", message: `No se pudo subir la foto: ${error.message}` };

  const { data } = supabase.storage.from(env.SUPABASE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Borra una foto anterior a partir de su URL pública. No falla el flujo si no se puede (best-effort). */
export async function deleteAvatarByUrl(url: string | null | undefined): Promise<void> {
  const supabase = getClient();
  if (!supabase || !url) return;
  const marker = `${PUBLIC_URL_MARKER}${env.SUPABASE_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  const path = url.slice(idx + marker.length);
  try {
    await supabase.storage.from(env.SUPABASE_BUCKET).remove([path]);
  } catch {
    // Best-effort: si falla el borrado de la foto vieja, no interrumpe el flujo del usuario.
  }
}
