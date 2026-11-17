# Preparación de la 1.2.1 para npm (2026-11-17)

Hecho en Windows 10, Node 24.20.0, pnpm 10.33.2, npm 11.19.0. Nada publicado ni subido: `npm publish`, la etiqueta, la release y el push son del propietario.

## Qué fallaba

- `pnpm build` se caía de vez en cuando en `build:rules`: `retorica/triada: demasiado lenta en texto adversarial: 251 ms > 250 ms`. En tres pasadas seguidas sin tocar nada daba 218, 200 y 182 ms.
- `pack:check` ejecutaba `node dist/cli/main.js` y nunca la orden `textoneitor` ni los `import`.
- `integrations/pre-commit/README.md` y `integrations/github-action/README.md` apuntaban a `jrollon/textoneitor`. La Action se pedía con `@v1` y las etiquetas que hay en el remoto son `v1.0.0`, `v1.1.0` y `v1.2.0`.
- Al `package.json` del paquete le faltaban `repository`, `homepage`, `bugs`, `author` y `keywords`.

## Qué se ha cambiado

- `structure`/`triad` busca desde las comas (`triadCandidates` en `src/rules/detectors/index.ts`). Sobre el texto adversarial de 1 MB, la búsqueda sola pasa de unos 125 ms a unos 13. Comparadas las dos versiones sobre ese texto (838 candidatas) y sobre README, CHANGELOG, `docs/decisions.md`, `docs/rules.md` y `examples/muestra-ia.md`: mismas candidatas y mismos offsets.
- Con el build nuevo, `textoneitor lint README.md CHANGELOG.md docs examples integrations -f json` da el mismo JSON byte a byte que con el anterior, y `rulepack.json` no cambia (antes de subir la versión).
- Diez `build:rules` seguidos: `retorica/triada` no aparece entre las tres más lentas; la más lenta es `densidad/adverbios-mente`, entre 145 y 166 ms. En la pasada final, con el resto del build en marcha, `retorica/triada` salió a 102 ms.
- Versión 1.2.1 en los dos `package.json`, `plugin.json`, `.pre-commit-hooks.yaml`, README, web y CHANGELOG. `prepublishOnly` reconstruye antes de publicar.
- `pack:check` instala en una carpeta con espacios y eñe y comprueba `npx textoneitor --version`, `npx textoneitor lint` y los `import` de `textoneitor`, `textoneitor/web` y `textoneitor/rulepack.json`.

## Salida

```
typecheck -> 0
build -> 0
test -> 0        (4 del gate + 98 del paquete)
gates -> 0       (Todos los gates en verde)
lint:self -> 0   (17 archivos, 0 error, 0 warning, 30 info)
pack:check -> 0
```

```
Empaquetado
  ✔ tarball: textoneitor-1.2.1.tgz
  ✔ 77 archivos, con CLI, API, Rule Pack, perfiles y licencia
Instalación en un directorio limpio
  ✔ instalado con npm install desde el tarball
Ejecución desde la instalación
  ✔ textoneitor 1.2.1
  ✔ npx textoneitor responde con la versión del paquete
  ✔ npx textoneitor lint analiza un archivo
  ✔ import de "textoneitor", "textoneitor/web" y el Rule Pack: mismo índice (82) por los dos caminos
  ✔ 38 reglas, las mismas que en el repositorio
  ✔ mismo JSON byte a byte que en el repositorio
  ✔ mismo resultado con un proxy inválido
```

`npm pack --dry-run`: 77 archivos, 366,2 kB empaquetado, 1,8 MB desempaquetado. `npm view textoneitor` da 404: el nombre está libre.

En `dist-release/` (no va al repositorio) quedan `textoneitor-1.2.1.tgz` y `textoneitor-claude-code-1.2.1.zip` para la release.

## Después de publicar

Publicado por el propietario el mismo día. El registro tardó unos cinco minutos en servir la versión y el archivo.

- `npm view textoneitor`: versión 1.2.1, `latest`, shasum `4126953084372bf15be641bc2da54adc41ee17a3`, el mismo que imprimió `npm publish`.
- En una carpeta limpia con espacios y eñe, `npm i -D textoneitor` instala la 1.2.1 desde el registro. `npx textoneitor --version` da 1.2.1, `rules list` da 38 reglas, los `import` de `textoneitor` y `textoneitor/web` dan el mismo índice (82) y `lint -f json` sobre `examples/muestra-ia.md` da el mismo JSON byte a byte que el repositorio. `npx textoneitor@1.2.1 lint` sin instalar antes también funciona.
- CI del pull request 2 y de `main` (aaaef11) en verde en Ubuntu, Windows y macOS con Node 20, 22 y 24, después de poner el build delante del typecheck en `ci.yml`.
- Etiqueta `v1.2.1` y release en GitHub con el `.tgz` bajado del registro y el zip del plugin.

## Lo que no está comprobado

- El hook de pre-commit y la GitHub Action contra el paquete de npm.
- `densidad/adverbios-mente` sigue a unos 160 ms de 250. No ha fallado, pero es la que menos margen tiene.
