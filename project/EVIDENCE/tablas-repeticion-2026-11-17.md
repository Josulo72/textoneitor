# Las tablas ya no cuentan como frases ni párrafos repetidos (2026-11-17)

Hecho en Windows 10, Node 24.20.0. Sin commit, sin push y sin publicar.

## Qué fallaba

Al pasar el revisor por el README de `Josulo72/rag-documental`, que tiene varias tablas de resultados, salían dos avisos y siete notas que no eran del texto:

- `repeticion/anafora`: "3 frases seguidas empiezan por «6 de»". Eran celdas seguidas de una tabla que dicen "6 de 6".
- `repeticion/inicio-parrafo`: "10 párrafos empiezan por «devoluciones 0»", "9 párrafos empiezan por «6 de»" y otras cinco parecidas. También celdas.

El detector `repetition` trataba cada celda como un párrafo, y sus frases como frases seguidas del documento. El propio YAML de `repeticion/anafora` ya lo tenía apuntado como falso positivo conocido.

## Qué se ha cambiado

Solo `repetition` en `packages/linter/src/rules/detectors/index.ts`:

- Con `block_start` (la regla `inicio-parrafo`), las celdas de tabla no se cuentan.
- Con `sentence_start` (la regla `anafora`), las frases de una celda no se cuentan y además cortan la racha, para que la frase de antes de una tabla y la de después no pasen por consecutivas.
- Con `ngram` no se ha tocado nada.

Las celdas siguen saliendo del Markdown como bloques `table_cell` y el resto de reglas las revisa igual. No cambia ningún YAML, así que el Rule Pack es el mismo.

Tests nuevos en `packages/linter/test/detectors.test.ts`: una tabla de celdas "6 de 6" no da nada en ninguna de las dos reglas, la prosa de fuera sigue disparando, una tabla en medio corta la racha y un término de léxico dentro de una celda se sigue marcando.

## Antes y después

`textoneitor lint` sobre el README de rag-documental (commit 958bd50) y sobre los dos textos de development v1.2 que llevan tabla:

| Archivo | Antes | Después |
|---|---|---|
| README de rag-documental | índice 6, 2 avisos y 13 notas | índice 4, 0 avisos y 6 notas |
| `corpus-v1.2/development/ai-r08.md` | índice 13 | índice 13, mismos hallazgos |
| `corpus-v1.2/development/ai-r12.md` | índice 29 | índice 29, mismos hallazgos |

Las nueve líneas que desaparecen del README son las siete de `inicio-parrafo` y las dos de `anafora` que salían de tablas. Las seis que quedan son de prosa.

## A qué afecta en el corpus

- Con tabla hay cinco textos, todos de v1.2 y todos README: `ai-r08` y `ai-r12` en development, `ai-r27`, `h-rd16` y `h-rd18` en holdout. En correo y en redes no hay ninguno, y en development v1.3 tampoco. El holdout v1.3 no se ha abierto.
- Los dos de development no cambian, así que la muestra adjudicada es la misma.
- Los tres del holdout v1.2 no se han vuelto a pasar. Las cifras publicadas en `benchmark/reports/v1.2.md` son de antes de este arreglo y no se han regenerado.
- El holdout v1.1, que es el que lee `pnpm gates`, da lo mismo que antes.

## Queda pendiente

- La nota de falsos positivos de `rules/definitions/repeticion--anafora.yml` sigue hablando de las tablas. Ya no es cierta, pero quitarla cambia el Rule Pack y no se ha tocado.
- Las rachas de `sentence_start` siguen cruzando de un párrafo a otro y de un elemento de lista al siguiente. No se ha cambiado porque movería los resultados del holdout v1.1.

## Salida

```
typecheck -> 0
build -> 0
test -> 0        (101 del paquete; detectors.test.ts pasa de 18 a 21)
gates -> 0       (Todos los gates en verde)
```
