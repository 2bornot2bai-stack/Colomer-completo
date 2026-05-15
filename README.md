# Colomer Web + Hub Premium Demo · GitHub Pages

Demo estática para presentar una versión demostrativa de la web premium y el Colomer Hub.

## Qué incluye

- `index.html` — web corporativa premium demostrativa.
- `hub.html` — Hub operativo premium demo.
- `styles.css` — diseño premium navy, oro y azul tecnológico.
- `app.js` — interacción demo, CRM local, subida simulada, lectura IA simulada y periodo de 15 días.
- `.nojekyll` — evita problemas de publicación en GitHub Pages.

## Credenciales demo del Hub

Email: `demo@colomerhub.es`  
Clave: `demo2026`

También hay botones rápidos para entrar como cliente o como equipo.

## Periodo de 15 días

El contador de 15 días se guarda en `localStorage` del navegador.

Esto sirve para una demo comercial, pero **no es seguridad real**. Si el usuario borra caché, cambia de navegador o usa incógnito, el periodo puede reiniciarse.

Para una versión real se necesita:

- login seguro,
- base de datos,
- almacenamiento documental,
- permisos y roles,
- trazabilidad,
- backups,
- configuración de servidor,
- revisión RGPD,
- contratación de servicios externos a nombre del cliente.

## Cómo subir a GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube estos archivos en la raíz del repositorio.
3. Entra en **Settings > Pages**.
4. En **Build and deployment**, selecciona:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Guarda y espera a que GitHub publique la URL.

## Notas de uso

- Todos los datos son ficticios.
- No se suben archivos reales.
- La lectura IA está simulada para enseñar el flujo.
- Los formularios guardan datos solo en el navegador.
- En producción habría que conectar email, CRM, base de datos, almacenamiento y seguridad real.
