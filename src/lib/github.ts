// Guarda un archivo en GitHub vía Contents API. El token vive SOLO en el servidor.
const TOKEN = import.meta.env.GITHUB_TOKEN ?? "";
const OWNER = import.meta.env.GITHUB_OWNER ?? "";
const REPO = import.meta.env.GITHUB_REPO ?? "";
const BRANCH = import.meta.env.GITHUB_BRANCH ?? "main";

const API = "https://api.github.com";

function headers() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "nochedepeli-cms", // obligatorio o GitHub responde 403
    "Content-Type": "application/json",
  };
}

export function githubListo(): boolean {
  return Boolean(TOKEN && OWNER && REPO);
}

// Lee el sha actual del archivo (si existe) para poder sobreescribirlo.
async function leerSha(ruta: string): Promise<string | undefined> {
  const r = await fetch(`${API}/repos/${OWNER}/${REPO}/contents/${ruta}?ref=${BRANCH}`, {
    headers: headers(),
  });
  if (r.status === 404) return undefined; // archivo nuevo
  if (!r.ok) throw new Error(`GitHub GET ${r.status}: ${await r.text()}`);
  const data = await r.json();
  return data.sha as string;
}

// Crea o actualiza un archivo con un commit. Devuelve la URL del commit.
export async function guardarArchivo(ruta: string, contenido: string, mensaje: string): Promise<string> {
  const sha = await leerSha(ruta);
  const cuerpo: Record<string, unknown> = {
    message: mensaje,
    content: Buffer.from(contenido, "utf8").toString("base64"), // base64 + UTF-8 (acentos ok)
    branch: BRANCH,
  };
  if (sha) cuerpo.sha = sha; // si ya existe, hay que mandar su sha

  const r = await fetch(`${API}/repos/${OWNER}/${REPO}/contents/${ruta}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(cuerpo),
  });
  if (!r.ok) throw new Error(`GitHub PUT ${r.status}: ${await r.text()}`);
  const data = await r.json();
  return data.commit?.html_url ?? "";
}

// Borra un archivo del repo (necesita su sha actual).
export async function borrarArchivo(ruta: string, mensaje: string): Promise<void> {
  const sha = await leerSha(ruta);
  if (!sha) throw new Error("El archivo no existe.");
  const r = await fetch(`${API}/repos/${OWNER}/${REPO}/contents/${ruta}`, {
    method: "DELETE",
    headers: headers(),
    body: JSON.stringify({ message: mensaje, sha, branch: BRANCH }),
  });
  if (!r.ok) throw new Error(`GitHub DELETE ${r.status}: ${await r.text()}`);
}
