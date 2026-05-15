# Colomer & Asociados · Web Premium + Colomer Hub Demo

Demo estática lista para subir a GitHub Pages.

Incluye:

- `index.html`: web corporativa premium.
- `hub.html`: área privada demo de Colomer Hub.
- `styles.css`: diseño responsive premium en estilo navy, oro y azul tecnológico.
- `app.js`: interacción, login demo, datos ficticios, bandeja documental y contador de 15 días.
- `.nojekyll`: evita procesamiento Jekyll en GitHub Pages.

## Credenciales de la demo

- Email: `demo@colomerhub.es`
- Clave: `demo2026`

## Periodo de demostración de 15 días

La demo inicia el contador en el primer acceso desde cada navegador usando `localStorage`.

Clave usada:

```txt
colomerDemoStartAt
```

Cuando pasan 15 días, el Hub muestra una pantalla de demo finalizada.

También puedes reiniciar la demo de dos formas:

1. Entrar en `hub.html?resetDemo=1`.
2. Desde el Hub, pestaña **Demo y seguridad**, pulsar **Reiniciar demo en este navegador**.

Importante: este bloqueo de 15 días es solo comercial y de demostración. No es seguridad real, no controla licencias de forma centralizada y puede reiniciarse si se borra el almacenamiento del navegador.

## Cómo subir a GitHub Pages

1. Crea un repositorio nuevo en GitHub, por ejemplo `colomer-web-hub-demo`.
2. Sube estos archivos en la raíz del repositorio:
   - `index.html`
   - `hub.html`
   - `styles.css`
   - `app.js`
   - `.nojekyll`
   - `README.md`
3. Entra en **Settings > Pages**.
4. En **Build and deployment**, elige:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Guarda los cambios.
6. GitHub generará una URL pública tipo:

```txt
https://usuario.github.io/colomer-web-hub-demo/
```

## Qué puede enseñarse en esta demo

- Diseño premium de web corporativa.
- Estructura de servicios.
- Explicación de Colomer Hub.
- Acceso privado simulado.
- Panel operativo con KPIs ficticios.
- Fichas de cliente demo.
- Bandeja documental con estados.
- Subida documental simulada.
- Mensajes y avisos demo.
- Periodo comercial de prueba de 15 días por navegador.

## Qué NO debe venderse como versión real

Esta demo no incluye:

- login seguro real,
- base de datos,
- almacenamiento documental real,
- permisos reales,
- cifrado,
- backups,
- auditoría de actividad,
- IA/OCR real,
- email transaccional,
- WhatsApp API,
- integración contable,
- cumplimiento RGPD completo,
- control centralizado de licencias.

## Recomendación para versión real

Para usar datos reales de clientes, la versión profesional debería incluir:

- autenticación segura,
- roles y permisos,
- base de datos,
- almacenamiento documental,
- cifrado y backups,
- registros de actividad,
- entorno cloud adecuado,
- textos legales y revisión RGPD,
- contrato de encargado de tratamiento si aplica,
- costes externos contratados preferiblemente a nombre del cliente.

## Costes externos

Dominio, hosting, almacenamiento, servidores, base de datos, APIs, IA/OCR, email transaccional, herramientas cloud, licencias, textos legales y otros consumos de terceros no forman parte de esta demo y deberán presupuestarse aparte en la versión real.
