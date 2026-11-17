# Privacidad

textoneitor no recoge datos. Tampoco los guarda ni los envía, y eso vale igual para el paquete de npm, para el plugin de Claude y para la web.

## El revisor y el plugin

El revisor analiza el texto en tu propio equipo, sin IA, sin mandarlo a ningún servidor y sin guardar copias de lo que lee. Solo devuelve lo que encuentra.

La skill del plugin es solo texto. El comando `/revisar` ejecuta `npx textoneitor` en tu equipo, y la primera vez `npx` descarga el paquete desde npm. Esa descarga la gestiona npm con sus propias condiciones. textoneitor no recibe nada de ella.

El plugin no lee credenciales, no usa claves y no se conecta a ningún otro servicio.

## La web

La web (josulo72.github.io/textoneitor) hace el análisis en tu navegador. No tiene analítica, no pone cookies y no envía el texto a ninguna parte. Está alojada en GitHub Pages, y GitHub puede registrar datos técnicos de las visitas, como la dirección IP, según su propia política de privacidad.

## Contacto

Para cualquier duda, abre un issue en https://github.com/Josulo72/textoneitor/issues.
