# Plan de mejora — Catálogo Digital Peñafiel

## Objetivo visual
Evolucionar a un estilo mixto premium: azul de marca, dorado, profundidad, iluminación elegante y animaciones equilibradas. Mantener buena legibilidad, velocidad y facilidad de uso móvil.

## Campaña de Halloween
Conservar los recursos temáticos como campaña temporal independiente. No mezclarlos con el diseño comercial principal. Antes de mover recursos o cambiar rutas, localizar todas las referencias actuales y validar que la campaña siga funcionando.

## Reglas de trabajo
- Trabajar en esta rama y no modificar `main` hasta revisar y validar los cambios.
- La rama `respaldo/antes-mejoras-2026-10-27` conserva el estado inicial antes de las mejoras.
- Priorizar herramientas gratuitas. No activar facturación ni suscripciones sin autorización explícita.
- No eliminar funciones existentes sin decisión del propietario.
- Separar gradualmente HTML, CSS, JavaScript y recursos cuando sea seguro.
- Hacer cambios pequeños, revisables y fáciles de revertir.

## Funciones que deben seguir funcionando
- Carrusel y presentación del catálogo.
- Visor/ampliación de imágenes.
- Descarga del catálogo PDF.
- Botón de contacto por WhatsApp.
- Pantalla de carga y ventanas promocionales/vídeos.
- Instalación PWA y manifiesto.
- Service worker y funcionamiento de caché.
- OneSignal y registro/recepción de notificaciones.
- Diseño responsive y compatibilidad con movimiento reducido.

## Hallazgos iniciales del repositorio
- `index.html` mide aproximadamente 79 KB y contiene HTML, múltiples bloques de estilos y varios bloques de JavaScript.
- Existen `efectos-catalogo.css` y `efectos-catalogo.js`, además de `manifest.json` y `service-worker.js`.
- La lista actual de archivos contiene varios recursos de campaña Halloween en la raíz, incluido `cementerio mortalkombat.gif` (~3.17 MB), `araña esquina.webp` (~827 KB), dos recursos WebP de arañas (~200 KB cada uno) y vídeos de campaña.
- El manifiesto declara actualmente `display: "browser"`; confirmar la intención de instalación antes de cambiarlo.
- El service worker usa una estrategia de red primero para navegación y caché de respaldo; cualquier modificación requiere pruebas de actualización y modo sin conexión.

## Etapas
1. Obtener una medición inicial en PageSpeed Insights (móvil y escritorio).
2. Revisar visualmente la web publicada en un teléfono real y comprobar las funciones clave.
3. Definir portada, jerarquía visual, tarjetas, botones y movimiento.
4. Optimizar primero los recursos pesados y efectos innecesarios, conservando los efectos de marca.
5. Refactorizar código por etapas, con cambios pequeños.
6. Probar todos los puntos de la lista de funciones.
7. Comparar resultados y, solo tras validar, decidir si integrar los cambios a `main`.

## Avance — 27 de octubre de 2026
- Se recibió la medición inicial móvil de PageSpeed: rendimiento 56, accesibilidad 100, recomendaciones 96 y SEO 100.
- Métricas destacadas: LCP 5.1 s, CLS 1.012, TBT 0 ms y tamaño total transferido 13,256 KiB.
- Primera modificación de bajo riesgo en `index.html`: prioridad alta para descubrir la imagen principal, decodificación asíncrona del banner, `preload="metadata"` para el video de bienvenida y dimensiones explícitas para el icono de WhatsApp (75 × 75, acorde con su CSS).
- Estos cambios están solo en `mejora/catalogo-premium`; la rama `main` y el sitio publicado no se han modificado.
- No se afirma todavía una mejora de puntuación: hace falta volver a medir y revisar visualmente la página.

## Próximos pasos
1. Repetir PageSpeed en la rama publicada después de una futura integración; para probar la rama antes, usar una vista previa o despliegue de prueba sin tocar `main`.
2. Identificar dimensiones reales y peso de las imágenes grandes para optimizarlas sin alterar el catálogo.
3. Investigar la causa concreta del CLS con el informe de elementos que cambian de posición.
4. Validar el funcionamiento de carga, carrusel, PDF, WhatsApp, PWA, caché y OneSignal antes de integrar.
