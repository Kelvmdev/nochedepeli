import { createHmac, timingSafeEqual } from "node:crypto";

// Secretos: en local van en .env.local; en producción, en el panel de Vercel.
const SECRET = import.meta.env.SESSION_SECRET ?? "";
export const PASSWORD = import.meta.env.ADMIN_PASSWORD ?? "";

const COOKIE = "sesion";
const DURACION_MS = 8 * 60 * 60 * 1000; // 8 horas

// Firma un texto con la llave secreta (HMAC-SHA256). Nadie puede falsificarlo sin la llave.
function firmar(texto: string): string {
  return createHmac("sha256", SECRET).update(texto).digest("base64url");
}

// Compara la clave sin fugar información por tiempo. Firmamos ambas (HMAC → largo fijo)
// y comparamos con timingSafeEqual, así ni el largo de la contraseña se filtra.
export function claveCorrecta(clave: string): boolean {
  if (!PASSWORD) return false;
  return timingSafeEqual(Buffer.from(firmar(clave)), Buffer.from(firmar(PASSWORD)));
}

// Crea el valor de la cookie: "expira.firma"
export function crearSesion(): string {
  const expira = String(Date.now() + DURACION_MS);
  return `${expira}.${firmar(expira)}`;
}

// Verifica que la cookie sea válida y no haya expirado.
export function sesionValida(valor: string | undefined): boolean {
  if (!valor || !SECRET) return false;
  const [expira, firma] = valor.split(".");
  if (!expira || !firma) return false;

  const esperada = firmar(expira);
  // Comparación segura (evita fugas por tiempo de respuesta)
  const a = Buffer.from(firma);
  const b = Buffer.from(esperada);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  return Number(expira) > Date.now();
}

export const NOMBRE_COOKIE = COOKIE;
export const OPCIONES_COOKIE = {
  httpOnly: true,
  secure: import.meta.env.PROD,
  sameSite: "lax" as const,
  path: "/",
  maxAge: DURACION_MS / 1000,
};
