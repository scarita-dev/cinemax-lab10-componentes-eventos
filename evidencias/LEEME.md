# Evidencias — Laboratorio 11: Comunicación entre componentes

Capturas y verificaciones del proyecto **CineMax** para el entregable del Laboratorio
11. La aplicación debe estar corriendo en `http://localhost:5173` antes de empezar.

```bash
npm install
npm run dev
```

> Consejo: usa una ventana de navegador de **1280×800** o más ancha para ver 4 columnas
> en la cartelera. La sección de estrenos tarda 2.2 s en cargar para poder observar el
> esqueleto; el error se demuestra con el botón **Simular error**.

---

## Capturas del Laboratorio 11

### 1. Pantalla completa

**Archivo:** `15-pantalla-completa.jpg`

Cabecera con el contador de favoritas, banner con el buscador y el botón **Limpiar
filtro**, sección de estrenos con el carrusel, cartelera de 9 películas y pie de página.

### 2. Aviso emergente al marcar una favorita

**Archivo:** `11-toast-favorita.jpg`

El aviso «Sombras del Alba» se añadió a favoritas aparece en la esquina inferior
derecha y el contador de la cabecera muestra `1`. La tarjeta cambió a **★ Favorita**.

### 3. Esqueleto de carga de los estrenos

**Archivo:** `12-estrenos-cargando.jpg`

Tres esqueletos animados en la sección **Próximos estrenos** mientras
`usePremieres` está en estado `loading`.

### 4. Estado de error de los estrenos

**Archivo:** `13-estrenos-error.jpg`

Panel de error con el mensaje «No se pudieron cargar los estrenos», el detalle de la
solicitud y los botones **Reintentar** y **Ver datos de ejemplo**.

### 5. Buscador con el botón Limpiar filtro

**Archivo:** `14-busqueda-limpiar.jpg`

Búsqueda `orion`: el texto vive en `query`, el filtro usa `debouncedQuery` y el banner
muestra el botón **Limpiar filtro** para vaciar input y listado en una sola acción.

### 6. Estructura del proyecto

**Archivo:** `16-estructura-proyecto.txt`

Árbol completo de carpetas y archivos, sin `node_modules` ni `dist`.

### 7. Consola sin errores y verificaciones

**Archivo:** `17-consola-sin-errores.txt`

Resultado de `npm run lint`, `npm run build`, la consola del navegador y las
comprobaciones funcionales realizadas (favoritas, filtro, estados y carrusel).

---

## Capturas de referencia del Laboratorio 10

Se conservan como respaldo del proyecto acumulativo:

- `07-pantalla-completa.png`
- `08-estado-vacio-buscador.png`
- `09-busqueda-orion.png`
- `10-favorita.png`
- `04-consola-sin-errores.png`
- `05-commits.png`

---

## Entrega

Las imágenes y verificaciones están en esta carpeta (`evidencias/`). Se suben con el
repositorio:

```bash
git add evidencias/
git commit -m "docs: agregar capturas de evidencias del laboratorio 11"
git push origin lab11-comunicacion-componentes
```
