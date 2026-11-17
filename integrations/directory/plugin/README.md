# textoneitor para Claude

Hace que Claude escriba en español como una persona y revisa lo que ya está escrito. Es la versión del plugin que está en el directorio de plugins de Claude, y funciona en Claude Code, en el chat de claude.ai y en Cowork.

Trae dos cosas.

La skill `escribir-en-espanol` es la guía de estilo, y Claude la usa cuando escribe en español para que lo lea alguien, sean respuestas, correos, README, publicaciones o documentación. Le dice cómo suena el español de una persona normal y qué tics delatan un texto generado, con ejemplos de cada uno.

El comando `/revisar` pasa el revisor de textoneitor a un archivo, a un texto pegado o a lo último que ha escrito Claude, y arregla lo que marca. Son 38 reglas deterministas. No usa IA. No manda tu texto a ninguna parte.

## Qué ejecuta y qué descarga

La skill es solo texto y no ejecuta nada.

El comando `/revisar` le pide a Claude que ejecute `npx textoneitor@1.2.1` en tu ordenador, y la primera vez `npx` descarga ese paquete de npm. Claude te pide permiso antes de ejecutarlo y el análisis se hace en local, así que el texto no sale de tu equipo. Si prefieres no usar `npx`, instala el paquete en tu proyecto con `npm i -D textoneitor`.

El plugin no guarda datos, no usa claves y no se conecta a ningún otro servicio.

## La versión completa

En el repositorio está también el plugin completo para Claude Code, en `integrations/claude-code`, que se instala desde las releases. Carga la guía al empezar cada sesión y tiene dos hooks opcionales que revisan cada respuesta y cada archivo de texto y le devuelven a Claude lo que han visto para que lo corrija.

Más información y una prueba en el navegador: https://josulo72.github.io/textoneitor/
