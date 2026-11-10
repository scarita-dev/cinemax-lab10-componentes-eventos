# Evidencias — Laboratorio 10: Componentes y eventos

Capturas del proyecto **CineMax** para el entregable del Laboratorio 10. La aplicación
debe estar corriendo en `http://localhost:5173` antes de empezar.

```bash
npm install
npm run dev
```

> Consejo: usa una ventana de navegador de **1280×800** o más ancha para que la
> cartelera se muestre en 3–4 columnas. Para las capturas de consola, abre
> Desarrollador (`F12`) en la pestaña **Console**.

---

## Capturas principales del Laboratorio 10

### 1. Pantalla completa con la cartelera

**Archivo:** `07-pantalla-completa.png`

Ventana con `http://localhost:5173`: header, banner con el buscador y su CTA
**Buscar**, las 9 tarjetas y el footer. Se aprecian los botones con los estilos del
componente reutilizable `Button`.

### 2. Tarjetas y botón de favorita

**Archivo:** `10-favorita.png`

Primera tarjeta con el botón en estado **★ Favorita** (variant `favorite`) y las demás
con **☆ Favorita** (variant `ghost`). Demuestra que el mismo `Button` cambia de aspecto
por props y que el estado de favoritas se refleja en la interfaz.

### 3. Búsqueda por título

**Archivo:** `09-busqueda-orion.png`

Búsqueda `orion`: el filtro ignora mayúsculas y acentos y deja solo «Rumbo a Orión».

### 4. Estado vacío del buscador

**Archivo:** `08-estado-vacio-buscador.png`

Búsqueda `zzz`: mensaje «No hay películas que coincidan con “zzz”» y botón
**Limpiar búsqueda** (variant `secondary`), en lugar de una lista vacía.

### 5. Consola sin errores

**Archivos:** `04-consola-sin-errores.png` (imagen) y
`evidencia-4-consola.html` (fuente, se puede reabrir en el navegador).

La consola muestra **cero errores y cero advertencias**. Los mensajes informativos
propios de la aplicación aparecen al escribir en el buscador:

```
[MovieSearch] keystroke -> "zzz"
[Filter] applied with "zzz"
```

La primera línea se repite en cada pulsación; la segunda aparece una sola vez, 300 ms
después de la última tecla.

### 6. Estructura de commits

**Archivos:** `05-commits.png` (imagen) y `evidencia-5-commits.html` (fuente).

Resultado de `git log --oneline --graph --all`, con los commits de la práctica
(`chore`, `refactor`, `feat`, `docs`) y el merge que integra el aporte del equipo.

---

## Capturas de referencia del Laboratorio 9

Se conservan como respaldo del proyecto acumulativo:

- `01-pantalla-completa.jpg`
- `02-hero.png`
- `03-moviecards.png`
- `06-estado-vacio-buscador.png`

---

## Entrega

Las imágenes están en esta carpeta (`evidencias/`) junto con las fuentes HTML de las
evidencias de consola y commits. Se suben con el repositorio:

```bash
git add evidencias/
git commit -m "docs: agregar capturas de evidencias del laboratorio 10"
git push origin main
```
