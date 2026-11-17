#!/usr/bin/env node
// Genera la skill del plugin del directorio de Claude (integrations/directory/plugin) a partir de la guía
// (integrations/claude-code/guia/humano.md). El directorio no acepta hooks ni scripts de organizaciones sin
// verificar, así que ese plugin lleva la guía como skill y /revisar sin permisos. Este archivo no va dentro
// del plugin: el plugin solo puede tener Markdown, JSON, YAML e imágenes.
//
// Uso: node integrations/directory/build.mjs          escribe la skill
//      node integrations/directory/build.mjs --check  sale con 1 si la skill del repositorio no está al día
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const aqui = path.dirname(fileURLToPath(import.meta.url));
export const SALIDA = path.join(aqui, "plugin", "skills", "escribir-en-espanol", "SKILL.md");
const GUIA = path.join(aqui, "..", "claude-code", "guia", "humano.md");

export function generar() {
  const guia = fs.readFileSync(GUIA, "utf8").replace(/\r\n/g, "\n").trim();
  return [
    "---",
    "name: escribir-en-espanol",
    "description: Guía para escribir en español de España como una persona normal y no como una máquina. Úsala siempre que escribas o reescribas texto en español para que lo lea alguien, en la conversación o en un archivo, como correos, README, mensajes, publicaciones o documentación.",
    "---",
    "",
    "<!-- Generado por integrations/directory/build.mjs a partir de integrations/claude-code/guia/humano.md. No se edita a mano. -->",
    "",
    guia,
    "",
  ].join("\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const nuevo = generar();
  if (process.argv.includes("--check")) {
    const actual = fs.existsSync(SALIDA) ? fs.readFileSync(SALIDA, "utf8").replace(/\r\n/g, "\n") : "";
    if (actual !== nuevo) {
      console.error("integrations/directory/plugin/skills/escribir-en-espanol/SKILL.md no está al día con la guía: node integrations/directory/build.mjs");
      process.exit(1);
    }
    console.log("SKILL.md al día");
  } else {
    fs.mkdirSync(path.dirname(SALIDA), { recursive: true });
    fs.writeFileSync(SALIDA, nuevo, "utf8");
    console.log(`Escrito ${path.relative(process.cwd(), SALIDA)}`);
  }
}
