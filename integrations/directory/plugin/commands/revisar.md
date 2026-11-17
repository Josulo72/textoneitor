---
description: Pasa el revisor a un archivo, a un texto pegado o a lo último que has escrito, y lo arregla.
argument-hint: "[archivo o nada]"
---

Revisa el español de $ARGUMENTS con el revisor de textoneitor y arregla lo que marque.

Cómo hacerlo:

1. Si hay un archivo en los argumentos, analízalo:
   `npx textoneitor@1.2.1 lint <archivo> --format revision`

2. Si no hay archivo, coge el texto que el usuario acaba de pegar o lo último que hayas escrito tú y pásalo por la entrada estándar con el perfil que toque:
   `npx textoneitor@1.2.1 lint --stdin --stdin-filename texto.md --profile chat --format revision`
   Los perfiles son `chat` para conversación, `correo`, `readme`, `redes`, y `general`, `tecnico`, `academico` o `marketing` para prosa editada.

   La primera vez, `npx` descarga el paquete de npm. El usuario tiene que aprobar el comando; si no quiere, dile que puede instalarlo en su proyecto con `npm i -D textoneitor` y no sigas.

3. Lee lo que marca. Por cada regla sale qué busca, una orientación para reescribir y dónde está cada caso. Es orientación: decide tú qué corriges, qué mantienes y qué hallazgo no aplica. Si quieres ver también los avisos de nivel info, añade `--verbose`. Para el detalle de una regla: `npx textoneitor@1.2.1 rules explain <id>`.

4. Arregla el texto. Reescribe de verdad la parte señalada, no la maquilles. Si es un archivo, edítalo; si es un texto de la conversación, enseña la versión corregida.

5. Vuelve a pasar el revisor para comprobar que ya no marca. Di qué has cambiado en una línea.

Si algún hallazgo te parece un falso positivo, dilo y déjalo como estaba. El índice mide patrones de escritura, no dice quién ha escrito el texto.
