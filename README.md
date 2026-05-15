# Colomer Web + Hub Premium Demo V3

Demo navegable preparada para GitHub Pages.

## Qué contiene

- `index.html`: web pública premium demostrativa de Colomer & Asociados.
- `hub.html`: Hub privado demo con dos perfiles: equipo y cliente.
- `styles.css`: diseño premium navy, oro y azul tecnológico.
- `app.js`: lógica demo con `localStorage`.
- `favicon.svg`: icono simple.
- `.nojekyll`: evita problemas de publicación en GitHub Pages.

## Credenciales demo

```txt
Email: demo@colomerhub.es
Clave: demo2026
```

Puedes entrar como:

- **Equipo Colomer**: ve leads, clientes, documentos, IA asistida, tareas, vencimientos y mensajes.
- **Cliente**: ve su panel, documentos, vencimientos y mensajes.

## Flujo comercial que demuestra

1. Un visitante entra en la web pública.
2. Rellena el formulario de diagnóstico.
3. Ese lead aparece en el Hub, en la sección **Leads web**.
4. El equipo puede cambiar el estado del lead.
5. El cliente o el equipo registra documentos ficticios.
6. El equipo cambia estados documentales.
7. La sección **IA asistida** simula extracción de datos.
8. El Hub muestra tareas, vencimientos, mensajes y dashboard.

## Demo de 15 días

La demo usa `localStorage` para guardar la fecha de inicio y calcular 15 días.

Esto sirve para presentación comercial, pero **no es una licencia real**.  
Si el usuario borra caché, cambia de navegador o usa otro dispositivo, el contador se reinicia.

Para una versión real haría falta:

- login seguro,
- base de datos,
- almacenamiento documental,
- permisos y roles,
- copias de seguridad,
- control de licencia desde servidor,
- trazabilidad,
- revisión RGPD, privacidad, cookies y seguridad.

## Cómo subir a GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube estos archivos directamente a la raíz del repositorio:
   - `index.html`
   - `hub.html`
   - `styles.css`
   - `app.js`
   - `favicon.svg`
   - `.nojekyll`
   - `README.md`
3. Ve a **Settings → Pages**.
4. En **Source**, selecciona la rama `main` y carpeta `/root`.
5. Guarda y espera a que GitHub genere la URL pública.

## Nota importante

Todos los datos son ficticios. No usar datos reales de clientes en esta demo.


---

## Corrección incluida en esta versión

Esta versión referencia `app-v3-fixed.js` y usa un namespace propio de `localStorage` para que una demo anterior no aparezca como caducada al subir una nueva versión al mismo dominio de GitHub Pages.

Si al abrirla sigue apareciendo una demo finalizada por caché del navegador, usar una de estas opciones:

1. Abrir la web añadiendo `?resetdemo=1` al final de la URL.
2. O abrir la consola del navegador y ejecutar:

```js
localStorage.clear();
location.reload();
```

El control de 15 días es solo para demo comercial. En producción se debe controlar desde servidor, con usuario, licencia, base de datos y permisos reales.


## Corrección v3.1 final

Esta versión corrige el problema por el que podía aparecer `Calculando…` en la barra superior.
La causa era que el HTML apuntaba a un archivo JavaScript que no siempre se incluía en el ZIP de subida.

En esta versión:
- `index.html` y `hub.html` cargan `app.js?v=v3-1-final`.
- `app.js` está incluido en raíz.
- Se mantiene `app-v3-fixed.js` solo como copia de seguridad.
- Si vienes de una publicación anterior, abre primero `?resetdemo=1`.

URL recomendada tras publicar:
`https://2bornot2bai-stack.github.io/Colomer-web/?resetdemo=1`


## Corrección v3.2 final

Además de cargar `app.js` correctamente, el texto inicial del contador aparece como `15 días restantes`.
Así, aunque el navegador tarde en cargar JavaScript, nunca se muestra `Calculando…` en la demo pública.
