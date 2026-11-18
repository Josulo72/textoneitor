# Preparación de la 1.2.2 para npm (2026-11-17)

Hecho en Windows 10, Node 24.20.0, en la rama `version-1.2.2`. Nada publicado: `npm publish`, la etiqueta y la release son del propietario.

## Qué lleva

Lo que entró con el pull request 8, que ya está en `main`:

- Las celdas de tabla y los elementos de lista no dan avisos falsos de `repeticion/anafora` ni de `repeticion/inicio-parrafo`.
- Un texto grande sin líneas en blanco ya no tira la orden.
- Los archivos en UTF-16 o binarios se saltan con aviso, y se avisa cuando un archivo nombrado queda fuera por `exclude` o `.gitignore`.

Y lo que estaba en `main` sin publicar desde la 1.2.1: la Action con Node 24 y los textos de las integraciones, que dicen "el revisor".

Las 38 reglas son las mismas. El Rule Pack solo cambia de número de versión, porque lo toma del paquete.

## Dónde se ha cambiado la versión

- `package.json` y `packages/linter/package.json`.
- `integrations/claude-code/.claude-plugin/plugin.json` e `integrations/directory/plugin/.claude-plugin/plugin.json`.
- `integrations/directory/plugin/README.md` y `commands/revisar.md`, que piden `npx textoneitor@1.2.2`.
- `.pre-commit-hooks.yaml`, que instala `textoneitor@1.2.2`.
- `README.md` (nombre del zip del plugin), `integrations/github-action/README.md` e `integrations/pre-commit/README.md` (etiqueta `v1.2.2`).
- `docs/rules.md`, que lo regenera el build.
- La línea `version` de `content.ts` en `apps/web`. Ese archivo tenía además cambios sin commitear de otro trabajo, que no se han tocado.
- `CHANGELOG.md`: la sección "Sin publicar" pasa a `[1.2.2] - 2026-11-17`.

## Ojo con el orden

Varias de estas referencias apuntan a cosas que no existen hasta que se publique: `textoneitor@1.2.2` en npm, la etiqueta `v1.2.2` y `textoneitor-claude-code-1.2.2.zip` en Releases. Entre que esto llegue a `main` y se publique, el hook de pre-commit de `main` y el `/revisar` del plugin del directorio piden una versión que npm todavía no tiene. Conviene mezclar y publicar seguido.

## Salida

```
typecheck -> 0
build -> 0
test -> 0        (104 del paquete)
gates -> 0       (Todos los gates en verde)
lint:self -> 0   (0 error, 0 warning, 31 info)
pack:check -> 0  (Empaquetado en verde)
textoneitor --version -> 1.2.2
```

## Después de publicar

Mezclado en `main` con el pull request 9 (4bb06dd) y publicado por el propietario el mismo día desde `packages/linter`. El registro tardó un par de minutos en servir la versión.

- `npm view textoneitor`: versión 1.2.2, `latest`, shasum `eddd21d69cb64e82e5caab0a2ae59daab688db6a`, el mismo que imprimió `npm publish`.
- Etiqueta `v1.2.2` sobre 4bb06dd y release en GitHub con `textoneitor-1.2.2.tgz` bajado del registro (367.642 bytes, mismo shasum) y `textoneitor-claude-code-1.2.2.zip` (16 archivos; lleva además el icono del plugin, que en la 1.2.1 no existía). La orden que va dentro del zip responde 1.2.2.
- En una carpeta limpia con espacios y eñe, `npm i -D textoneitor` instala la 1.2.2. `npx textoneitor --version` da 1.2.2 y `lint -f json` sobre `examples/muestra-ia.md` da el mismo JSON que el repositorio, salvo los tiempos. Una tabla con celdas "6 de 6" y una lista con "Se añade…" tres veces dan 0 hallazgos con la versión instalada.

## Lo que no está comprobado

- El hook de pre-commit con `rev: v1.2.2`: en esta máquina no está `pre-commit`.
- La GitHub Action con `@v1.2.2`: no hay ningún workflow en el repositorio que la use.
- El plugin cargado en Claude Code desde el zip.

## Aviso de npm audit

Al instalar, npm avisa de "4 high severity vulnerabilities". Es una sola, en cadena: `picomatch` (ReDoS con ciertos patrones, GHSA-fc5q-39xc-vjpf), que llega por `fast-glob` → `micromatch`. npm dice que no hay arreglo disponible. Los patrones que recibe `fast-glob` aquí son los que escribe el propio usuario en la orden o en su `textoneitor.yml`, así que el riesgo real es bajo, pero quien instale lo va a ver. Quitarlo es cambiar de dependencia y no se ha tocado. Pasaba igual con la 1.2.1.
