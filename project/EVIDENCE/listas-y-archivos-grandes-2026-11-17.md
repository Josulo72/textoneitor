# Listas en las repeticiones y caída con archivos grandes (2026-11-17)

Hecho en Windows 10, Node 24.20.0, en la rama `tablas-repeticion`. Sale de una auditoría de lectura hecha antes de lanzar.

## Qué fallaba

1. Un archivo de texto grande sin líneas en blanco tiraba la orden: `textoneitor: Maximum call stack size exceeded`, salida 2. Con 12.000 líneas seguidas (691 KB) ya pasaba, y con una sola línea de 1,6 MB también. Si el archivo estaba dentro de una carpeta, se perdía la pasada entera. El origen era `tokens.push(...t)` en `src/document/index.ts`: un bloque de más de cien mil tokens no cabe como lista de argumentos. El test de 1 MB adversarial no lo veía porque ese texto va en varios bloques.
2. Las listas hacían lo mismo que las tablas. Un listado de cambios con "Se añade…" en tres elementos seguidos, o unos pasos con "Abre la…", daban aviso de `repeticion/anafora` y nota de `repeticion/inicio-parrafo`, en los perfiles general, readme, tecnico, chat y correo.

## Qué se ha cambiado

- `src/document/index.ts`: frases y tokens se añaden de uno en uno. Mismo resultado, sin límite por tamaño de bloque.
- `repetition` en `src/rules/detectors/index.ts`:
  - `block_start`: un elemento de lista no cuenta como párrafo.
  - `sentence_start`: una racha de frases no pasa de un elemento de lista a otro, ni del párrafo de antes al primer elemento. Dentro de un mismo elemento sí cuenta, y entre párrafos normales sigue igual que antes.
- Las listas de arranque uniforme las sigue cubriendo `estructura/lista-inicio-uniforme` (cuatro elementos seguidos con la misma primera palabra, `candidate`).

No cambia ningún YAML, así que el Rule Pack es el mismo.

Tests nuevos: uno en `test/document.test.ts` (un bloque de 12.000 líneas, 132.000 palabras) y uno en `test/detectors.test.ts` (listado de cambios, pasos numerados, anáfora dentro de un elemento, párrafo seguido de lista y párrafos normales).

## Antes y después

| Prueba | Antes | Después |
|---|---|---|
| `.txt` de 12.000 líneas sin blancos (691 KB) | salida 2, pila desbordada | se analiza, salida 0 |
| Una línea de 1,6 MB | salida 2, pila desbordada | se analiza, salida 0 |
| Listado de cambios y pasos de prueba | 3 avisos y 3 notas | 0 hallazgos |
| README de rag-documental | índice 4, 6 notas | índice 2, 4 notas |
| 222 textos de development (v1.1, v1.2 y v1.3) | 102 hallazgos | los mismos 102, ningún índice cambia |

Los textos de development se han pasado con el perfil por defecto, copiados a una carpeta temporal. Ningún holdout se ha abierto fuera de lo que ya hace `pnpm gates` con el de v1.1, que coincide con `benchmark/reports/holdout-v1.1.json`.

## Avisos de lo que no se analiza (segunda tanda, mismo día)

Dos cosas más de la auditoría, las dos en la orden y sin tocar reglas:

- Un archivo en UTF-16 o un binario con extensión `.md` daba "1 archivo, 0 hallazgos, OK" sin haber leído nada. Ahora `scanProject` se lo salta si el texto leído lleva un carácter nulo, y la orden lo dice por stderr: `textoneitor: 1 archivo(s) sin analizar porque no son texto en UTF-8 (utf16.md)`. Ya no aparece en el informe.
- Un archivo nombrado a mano que `exclude` o `.gitignore` dejan fuera daba "0 archivos, OK" sin más. Sigue sin ser un error, porque así lo pasa pre-commit, pero ahora se dice por stderr.

La salida no cambia en ninguno de los dos casos, y el JSON y el SARIF no llevan campos nuevos. El JSON de los 222 textos de development es idéntico al de antes salvo los tiempos, y en esa pasada no sale nada por stderr. Test nuevo en `test/cli.e2e.test.ts`.

Un archivo en Latin-1 se sigue analizando como hasta ahora: no lleva nulos y las fórmulas sin tilde se encuentran igual. No se ha tocado.

Durante estas pasadas `pnpm build` falló una vez con `densidad/adverbios-mente: demasiado lenta en texto adversarial: 296 ms > 250 ms`. Cinco `build:rules` seguidos dieron entre 150 y 157 ms y el build siguiente pasó. Es el mismo fallo intermitente por carga de la máquina que ya se vio con `retorica/triada`.

## Lo que la auditoría encontró y no se ha tocado

- La raya de diálogo ("—¿Vienes? —preguntó ella") sale como raya de inciso en readme, chat, correo y redes. `formato/raya` es "cualquier raya" por definición y su YAML ya lo apunta como falso positivo. Arreglarlo es cambiar la regla.
- Los títulos con nombres propios ("Integración con Visual Studio Code") salen como Title Case. También está apuntado en su YAML. Sin una lista de nombres no hay arreglo determinista.
- Las citas con `>` se revisan como texto del autor, que es lo que dice la arquitectura. En los 222 textos de development no hay ninguna cita, así que no hay datos para decidir.
- Las fórmulas con imperativo de tú ("sumérgete") no cubren el voseo ni el ustedes.
- La web y las integraciones no se han revisado.

## Salida

```
typecheck -> 0
build -> 0       (a la segunda; ver arriba)
test -> 0        (104 del paquete)
gates -> 0       (Todos los gates en verde)
lint:self -> 0   (0 error, 0 warning, 34 info)
pack:check -> 0  (Empaquetado en verde)
```
