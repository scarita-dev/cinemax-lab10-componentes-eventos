# Entregable — Laboratorio extra S11: los hooks del agente

| | |
|---|---|
| Curso | Desarrollo de Aplicaciones Empresariales (DAE) |
| Semana | 11 (laboratorio extra) |
| Autora | Sofía Carita (`scarita-dev`) |
| Fecha | 15/11/2026 |
| Repositorio | <https://github.com/scarita-dev/cinemax-lab10-componentes-eventos> |
| Rama de este entregable | `lab11-extra-hooks-del-agente` (no se fusiona con `main` ni con `lab11-comunicacion-componentes`) |
| Proyecto | `dae-s11-hooks-del-agente` (plantilla del laboratorio) |
| Entorno de las pruebas | Node v22.23.5 · npm 10.9.9 · Vitest 3.2.7 · React 19 |

> Nota de honestidad: la carpeta del proyecto no traía historial de Git. Se inicializó un repositorio
> local y el **primer commit** (`9736fea`) guarda el estado original de la plantilla, incluidos los tres
> hooks de la IA (`src/ai/`) **sin arreglar**. Los commits siguientes son el trabajo.

## 1. Qué se entregó

Se completaron las cinco partes de la guía:

1. `src/hooks/useDebounce.js`: valor «tranquilo» con temporizador cancelable y limpieza al desmontar.
2. `src/hooks/usePlans.js`: los tres estados de la petición, `reload()` y descarte de la respuesta vieja.
3. `src/hooks/useAgentRun.js`: máquina de estados de la ejecución, con la barrera de seguridad de R2,
   cancelación por `AbortSignal` y limpieza al desmontar.
4. `src/ai/`: revisión y arreglo de los **seis fallos** de los tres hooks «escritos por una IA».
5. Este documento: las cuatro preguntas del diff por cada hook, conteos antes/después, el árbol de
   componentes con el dato de cada nivel, la explicación de por qué la interfaz no es la frontera de
   seguridad y la tabla de uso de IA con un rechazo y su diff.

Resultado final: **57/57 pruebas en verde** tanto contra `src/hooks` (`npm test`) como contra `src/ai`
(`npm run test:ai`), y `npm run build` sin errores.

## 2. Cómo reproducirlo

```powershell
npm install
npm test          # src/hooks: debe terminar en 57 passed
npm run test:ai   # src/ai: debe terminar en 57 passed
npm run build     # compila la app en dist/
```

Las salidas completas de cada corrida quedaron guardadas en [`evidencias/`](evidencias/), sin códigos de
color, para que se puedan leer y comparar.

## 3. Conteo de pruebas: antes y después

### 3.1 Mis hooks (`npm test`, alias `@hooks` → `src/hooks`)

Estado inicial de la plantilla, con los tres `TODO` sin resolver:

| Archivo de pruebas | Pruebas | Fallan antes | Fallan después |
|---|---:|---:|---:|
| `src/test/useDebounce.test.jsx` | 10 | 5 | 0 |
| `src/test/usePlans.test.jsx` | 12 | 11 | 0 |
| `src/test/useAgentRun.test.jsx` | 18 | 14 | 0 |
| `src/test/App.test.jsx` (integración) | 7 | 5 | 0 |
| `src/test/Inbox.test.jsx` (integración) | 10 | 5 | 0 |
| **Total** | **57** | **40** | **0** |

- Antes: [`evidencias/01-antes-team.txt`](evidencias/01-antes-team.txt) — `Tests 40 failed | 17 passed (57)`.
- Después: [`evidencias/07-despues-team.txt`](evidencias/07-despues-team.txt) — `Tests 57 passed (57)`.
- Por hook, ya en verde: [`04-useDebounce-verde.txt`](evidencias/04-useDebounce-verde.txt) (10/10),
  [`05-usePlans-verde.txt`](evidencias/05-usePlans-verde.txt) (12/12) y
  [`06-useAgentRun-verde.txt`](evidencias/06-useAgentRun-verde.txt) (18/18).

### 3.2 Los hooks de la IA (`npm run test:ai`, alias `@hooks` → `src/ai`)

| Momento | Fallan | Pasan |
|---|---:|---:|
| Plantilla original (tres hooks de la IA sin tocar) | 20 | 37 |
| Tras arreglar el fallo 1 (`src/ai/useDebounce.js`) | 15 | 42 |
| Tras arreglar los fallos 2 y 3 (`src/ai/usePlans.js`) | 9 | 48 |
| Tras arreglar los fallos 4, 5 y 6 (`src/ai/useAgentRun.js`) | 0 | 57 |

Por archivo, de la plantilla al final:

| Archivo | Fallan antes | Fallan después |
|---|---:|---:|
| `useDebounce.test.jsx` | 5 | 0 |
| `usePlans.test.jsx` | 5 | 0 |
| `useAgentRun.test.jsx` | 7 | 0 |
| `App.test.jsx` | 1 | 0 |
| `Inbox.test.jsx` | 2 | 0 |
| **Total** | **20** | **0** |

Evidencias: [`02-antes-ai.txt`](evidencias/02-antes-ai.txt),
[`08-ai-tras-fallo-1.txt`](evidencias/08-ai-tras-fallo-1.txt),
[`09-ai-tras-fallos-2-3.txt`](evidencias/09-ai-tras-fallos-2-3.txt) y
[`10-despues-ai.txt`](evidencias/10-despues-ai.txt).

### 3.3 El parche que se rechazó

La primera versión de `usePlans` que propuso el asistente resolvía los tres estados y `reload()`, pero
**no ignoraba la respuesta vieja**. Corrida de pruebas sobre ese parche:

```
$ npm test -- usePlans
Test Files  1 failed (1)
Tests       4 failed | 8 passed (12)
```

Las cuatro pruebas que fallaron fueron las del bloque «ignora la respuesta vieja (carrera de
peticiones)»: respuesta vieja pisando a la nueva, error viejo pisando planes nuevos, cambio de
`fetchPlans` y `StrictMode`. Mensajes reales:

```
AssertionError: expected [ { id: 'T-01', …(5) }, …(1) ] to deeply equal [ { id: 'T-03', …(5) }, … ]
AssertionError: expected 'error' to be 'ready'
```

Evidencia completa: [`03-rechazo-usePlans-v1.txt`](evidencias/03-rechazo-usePlans-v1.txt). El diff entre lo
rechazado y lo aceptado está en [`evidencias/diferencias/rechazo-usePlans.diff`](evidencias/diferencias/rechazo-usePlans.diff)
y se reproduce en la sección 8.2. Después de añadir `cancelled` y la limpieza, las 12 pruebas pasaron.

## 4. Las cuatro preguntas de revisión del diff

Las preguntas se responden **por cada hook**. «No sé» cuenta como «no»; por eso cada «sí» cita la
prueba o el fragmento que lo demuestra.

### 4.1 `src/hooks/useDebounce.js` (hook propio)

| # | Pregunta | Respuesta | Evidencia |
|---|---|---|---|
| 1 | ¿Hooks en el mismo orden y en el nivel superior? | **Sí.** Solo `useState(value)` y un `useEffect` incondicional; no hay `if`, bucles ni `return` antes. | Código del hook; `useDebounce.test.jsx` 10/10. |
| 2 | ¿Todo `useEffect` que abre algo lo limpia al repetirse y al desmontar? | **Sí.** El `setTimeout` se crea dentro del efecto y la función de limpieza hace `clearTimeout(timer)`; React la ejecuta antes de repetir el efecto y al desmontar. | `al desmontar con varios cambios en el aire no queda ningún temporizador vivo` verifica `vi.getTimerCount() === 0`; `tres cambios seguidos devuelven solo el último` demuestra que los temporizadores intermedios ya no existen. |
| 3 | ¿Se resuelven los tres estados (cargando, con datos, error) y se ven? | **No aplica al hook**: no hace peticiones. El hook solo mantiene el valor actual y el «tranquilo». Los tres estados de la pantalla los resuelve `usePlans` y `App` los dibuja: `PlansSkeleton` (cargando), `Inbox` (datos) y `ErrorBanner` (error). | `App.test.jsx`: «muestra el esqueleto mientras carga y los planes cuando llegan» y «si la red falla muestra el error y Reintentar vuelve a cargar». |
| 4 | ¿El dato vive en el ancestro más bajo que lo necesita? | **Sí.** `query` vive en `Inbox` (es lo único que lo necesita) y `debounced` vive dentro del hook, en el mismo `Inbox`; no se subió a `App`. El `<input>` sigue mostrando `query` al instante. | `Inbox.test.jsx`: «el campo muestra lo escrito al instante, pero la lista espera 300 ms». |

### 4.2 `src/hooks/usePlans.js` (hook propio)

| # | Pregunta | Respuesta | Evidencia |
|---|---|---|---|
| 1 | ¿Hooks en el mismo orden y en el nivel superior? | **Sí.** Tres `useState`, un `useEffect` y un `useCallback`, siempre en el mismo orden; no hay retornos tempranos. | Código; 12/12 en `usePlans.test.jsx`. |
| 2 | ¿Todo `useEffect` que abre algo lo limpia? | **Sí.** Cada corrida del efecto crea `let cancelled = false` y devuelve `() => { cancelled = true; }`. Así se ignoran respuestas de un `reload` anterior, de un `fetchPlans` anterior, del doble montaje de `StrictMode` y del desmontaje. | `si la primera respuesta llega DESPUÉS de la segunda, no pisa a la nueva`; `con StrictMode… gana la respuesta de la segunda`; `si la respuesta llega después de desmontar, no pasa nada`. |
| 3 | ¿Se resuelven los tres estados y se ven? | **Sí.** `loading` (planes `[]`, error `null`), `ready` (planes recibidos) y `error` (el error de la promesa). `App` dibuja esqueleto, bandeja o `ErrorBanner` con «Reintentar». | `al llegar los planes pasa a ready…`; `si la petición falla pasa a error, con el error y sin planes`; pruebas de `App` de carga y error. |
| 4 | ¿El dato vive en el ancestro más bajo que lo necesita? | **Sí.** El hook se usa en `App` porque es el ancestro común más bajo de `Header` (necesita el número de pendientes) y `Inbox` (necesita la lista). No se guarda una segunda copia de `plans` en `Inbox`. `reload` es estable (`useCallback`) porque `App` lo pasa a los botones. | `App.jsx` líneas 14–16 y 33; `reload mantiene la misma identidad entre dibujados`; `no pide los planes otra vez en cada dibujado`. |

### 4.3 `src/hooks/useAgentRun.js` (hook propio)

| # | Pregunta | Respuesta | Evidencia |
|---|---|---|---|
| 1 | ¿Hooks en el mismo orden y en el nivel superior? | **Sí.** `useState`, `useRef`, `useRef`, `useCallback` y `useEffect`, todos incondicionales. El caso «`runAgent` puede faltar» se resuelve **dentro** de `start`, no con un `return` antes de los hooks. | `sin runAgent se queda en idle y start() no hace nada` y `si runAgent aparece en un dibujado posterior, el hook no se rompe y funciona` (esta prueba es la que hacía estallar a la versión de la IA). |
| 2 | ¿Todo `useEffect` que abre algo lo limpia? | **Sí.** El único efecto existe justamente para la limpieza: al desmontar hace `controller.current?.abort()`. Además, `reject()` aborta y toda respuesta tardía se descarta con `if (current.signal.aborted) return`. | `al desmontar con una ejecución en curso aborta su señal` (`signal.aborted` pasa a `true`); `reject() mientras corre aborta la señal… y descarta lo que llegue después`. |
| 3 | ¿Se resuelven los tres estados y se ven? | **Sí, y son cinco.** `idle`, `running`, `awaiting_approval`, `done` y `error`; `RunPanel` dibuja un bloque distinto para cada uno y el error muestra `run.error.message`. | `al terminar bien va directo a done…` (`seen` = `idle, running, done`); `solo approve() lo lleva a done…` (`seen` = `idle, running, awaiting_approval, done`); `si el agente falla, lo dice` en `Inbox.test.jsx`. |
| 4 | ¿El dato vive en el ancestro más bajo que lo necesita? | **Sí.** El estado de la ejecución vive en `RunPanel`, que es el único componente que lo usa; no se subió a `Inbox` ni a `App`. `Inbox` solo calcula `approvedPlans` y pasa `runAgent`. | `RunPanel.jsx` línea 8; el árbol de la sección 6. |

### 4.4 `src/ai/useDebounce.js` (hook de la IA: rechazado y luego arreglado)

| # | Pregunta | Respuesta | Evidencia |
|---|---|---|---|
| 1 | ¿Hooks en el mismo orden y en el nivel superior? | **Sí.** `useState`, `useRef` y dos `useEffect` incondicionales. El orden estaba bien; el fallo era otro. | Código original en el commit `9736fea`. |
| 2 | ¿Todo `useEffect` que abre algo lo limpia? | **No.** El temporizador se guardaba en un `useRef` y solo se limpiaba en un segundo efecto con `[]`, es decir, al desmontar y **solo el último**. Al cambiar el valor, los temporizadores anteriores seguían vivos y emitían valores intermedios. | `expected 'b' to be 'a'` (se devolvió un valor que debía descartarse) y `expected 2 to be +0` (dos temporizadores vivos tras desmontar). Ver [`02-antes-ai.txt`](evidencias/02-antes-ai.txt). |
| 3 | ¿Se resuelven los tres estados? | **No aplica**: no hace peticiones. Los estados de pantalla siguen en `usePlans`/`App`. | — |
| 4 | ¿El dato vive en el ancestro más bajo? | **Sí.** El valor «tranquilo» vive dentro del hook, en `Inbox`; no se elevó. El arreglo no movió estado de sitio. | Diff [`ai-useDebounce.diff`](evidencias/diferencias/ai-useDebounce.diff). |

### 4.5 `src/ai/usePlans.js` (hook de la IA: rechazado y luego arreglado)

| # | Pregunta | Respuesta | Evidencia |
|---|---|---|---|
| 1 | ¿Hooks en el mismo orden y en el nivel superior? | **Sí.** `useState` ×4, `useEffect` y `useCallback`, incondicionales. | Código original. |
| 2 | ¿Todo `useEffect` que abre algo lo limpia? | **No.** No había función de limpieza ni bandera de cancelación: la respuesta lenta de una petición anterior pisaba a la nueva. | `expected [ { id: 'T-01' … } ] to deeply equal [ { id: 'T-03' … } ]` en la prueba de `StrictMode`; y la del cambio de `fetchPlans`. |
| 3 | ¿Se resuelven los tres estados y se ven? | **No.** El camino de error solo hacía `console.error`, así que la pantalla se quedaba en «cargando» para siempre y `error` nunca se guardaba. | `expected 'loading' to be 'error'` (dos pruebas: «si la petición falla…» y «después de un error, reload()…»). Además `App` fallaba su prueba de error. |
| 4 | ¿El dato vive en el ancestro más bajo? | **Sí.** El estado vive en el hook, que se usa en `App`, el ancestro común más bajo de `Header` e `Inbox`. El arreglo no movió estado de componente. | Diff [`ai-usePlans.diff`](evidencias/diferencias/ai-usePlans.diff). |

### 4.6 `src/ai/useAgentRun.js` (hook de la IA: rechazado y luego arreglado)

| # | Pregunta | Respuesta | Evidencia |
|---|---|---|---|
| 1 | ¿Hooks en el mismo orden y en el nivel superior? | **No.** Había un `if (!runAgent) return …` **antes** de `useRef` y `useCallback`. El número de hooks cambiaba entre dibujados y React lanzaba «Rendered more hooks than during the previous render» cuando `runAgent` aparecía después. | `expected [Function] to not throw an error but 'Error: Rendered more hooks than during the previous render' was thrown` en `si runAgent aparece en un dibujado posterior…`. |
| 2 | ¿Todo `useEffect` que abre algo lo limpia? | **No.** No existía ningún efecto de limpieza: al desmontar no se abortaba la ejecución en curso. | `expected false to be true` en `al desmontar con una ejecución en curso aborta su señal` (nadie puso `signal.aborted` en `true`). |
| 3 | ¿Se resuelven los tres estados y se ven? | **Parcialmente.** `idle`, `running`, `done` y `error` existían y `RunPanel` los dibuja, pero faltaba la transición `awaiting_approval`: **todo** terminaba en `done`. No era un estado ausente, era un estado al que nunca se llegaba. | `expected 'done' to be 'awaiting_approval'` y `expected(seen).not.toContain("done")`. Es el fallo de seguridad nº 6. |
| 4 | ¿El dato vive en el ancestro más bajo? | **Sí.** `RunPanel` es el único consumidor del estado de ejecución; el arreglo no lo subió a `Inbox` ni a `App`. | Diff [`ai-useAgentRun.diff`](evidencias/diferencias/ai-useAgentRun.diff). |

## 5. Los seis fallos de los hooks «escritos por la IA»

| # | Archivo | Fallo | Tipo | Antes → después |
|---|---|---|---|---|
| 1 | `src/ai/useDebounce.js` | El temporizador se limpia en un efecto aparte y solo el último: al cambiar el valor quedan temporizadores viejos y se emiten valores intermedios. | Falta de limpieza del efecto / fuga de temporizador | 5 fallan → 0 |
| 2 | `src/ai/usePlans.js` | El rechazo de la promesa solo se registra en `console.error`: `status` se queda en `loading` y `error` nunca se guarda. | Estado de error no resuelto | 2 fallan → 0 (junto con nº 3) |
| 3 | `src/ai/usePlans.js` | No hay bandera de cancelación ni limpieza: la respuesta vieja pisa a la nueva (`reload`, cambio de `fetchPlans`, `StrictMode`, desmontaje). | Carrera de peticiones / respuesta vieja | 3 fallan → 0 |
| 4 | `src/ai/useAgentRun.js` | `return` temprano **antes** de `useRef`/`useCallback` cuando falta `runAgent`: los hooks cambian de número entre dibujados. | Violación de las reglas de los hooks | 1 falla → 0 (junto con nº 5 y nº 6) |
| 5 | `src/ai/useAgentRun.js` | No hay efecto de limpieza al desmontar: la ejecución sigue viva y puede tocar el estado de un componente desmontado. | Falta de limpieza / `AbortSignal` sin abortar | 1 falla → 0 |
| 6 | `src/ai/useAgentRun.js` | Todo resultado bueno va a `done`, sin mirar `plan.risk`: un R2 se aplica sin aprobación humana. | Barrera de seguridad ausente | 5 fallan → 0 |

Detalle de cada arreglo:

1. **useDebounce.** Se eliminó el `useRef`. El `setTimeout` se crea en el efecto con dependencias
   `[value, delay]` y la limpieza hace `clearTimeout(timer)`. Con eso, cada cambio cancela el
   temporizador anterior y el desmontaje no deja ninguno vivo.
2. **usePlans, error.** El segundo argumento de `.then` ahora hace `setError(err); setStatus("error")`.
   Ya no hay `console.error` como sustituto de estado.
3. **usePlans, respuesta vieja.** Cada corrida del efecto declara `let cancelled = false` y devuelve
   `() => { cancelled = true; }`. Los dos caminos (éxito y error) comprueban `if (cancelled) return`
   antes de tocar el estado.
4. **useAgentRun, hooks condicionales.** Se quitó el `return` temprano. Todos los hooks se ejecutan
   siempre y `start()` comprueba `if (!runAgent) return;` dentro de la función.
5. **useAgentRun, desmontaje.** Se añadió un `useEffect` con limpieza que hace
   `controller.current?.abort()`. Las respuestas tardías ya no pasan el filtro `signal.aborted`.
6. **useAgentRun, R2.** Al resolver, el estado se elige así:
   `plan.risk === "R2" ? "awaiting_approval" : "done"`. Un R2 solo llega a `done` con `approve()`.

## 6. Árbol de componentes y el dato de cada nivel

```
App                                  ← usePlans (status, plans, error, reload)
│                                      useState decisions (persistido en localStorage)
│                                      useState failing (interruptor de red simulada)
│                                      pendingCount = derivado de plans + decisions
├── Header({ pendingCount })         ← solo el número (o null mientras carga)
├── toolbar                          ← failing (local de App) y reload()
├── PlansSkeleton()                  ← sin props ni estado (status === "loading")
├── ErrorBanner({ error, onRetry })   ← error de usePlans y reload() (status === "error")
└── Inbox({ plans, decisions, onDecide, runAgent })
    │                                  useState query  → useDebounce(query, 300) = quietQuery
    ├── PlanCard({ plan, onDecide })   ← sin estado propio; decide si mostrar HashConfirm
    │   └── HashConfirm({ hash, onConfirm })
    │                                  useState typed  ← el texto que escribe la persona
    └── RunPanel({ approvedPlans, runAgent })
        └── useAgentRun(runAgent)      ← status, plan, result, error; start, approve, reject
```

| Dato | Vive en | Quién lo lee | Por qué ese nivel |
|---|---|---|---|
| `status`, `plans`, `error` | `usePlans`, llamado desde `App` | `App` (decide qué dibujar), `Inbox` (lista), `Header` (solo el número derivado) | `App` es el ancestro común más bajo de la cabecera y la bandeja. Bajarlo a `Inbox` obligaría a subir el contador o a duplicar la petición. |
| `decisions` | `App` | `Header` (cuenta pendientes), `Inbox` (separa pendientes/decididos), `PlanCard` (indirectamente vía `onDecide`) | Lo necesitan dos ramas distintas del árbol. Se persiste en `localStorage` desde `App`. |
| `pendingCount` | **derivado** en `App`, no es estado | `Header` | Se calcula en cada dibujado (`plans.filter(...)`); guardarlo sería un segundo estado que se puede desincronizar. `Header` recibe el número, nunca la lista. |
| `query` | `Inbox` | el `<input>` de búsqueda | Es el ancestro más bajo que lo necesita; ningún otro componente busca. |
| `quietQuery` | dentro de `useDebounce`, en `Inbox` | el filtro de la lista | Es un valor derivado de `query`; no sale de la bandeja. |
| `typed` (hash) | `HashConfirm` | el botón «Aprobar» del plan R2 | Solo esa tarjeta necesita saber si el hash escrito coincide. |
| `status/plan/result/error` de la ejecución | `useAgentRun`, llamado desde `RunPanel` | `RunPanel` | Solo el panel de ejecución consume la máquina de estados; subirla a `Inbox` o `App` sería «por si acaso». |
| `failing` | `App` | el interruptor y `lib/api.js` (`network.failing`) | Es una opción global de la red simulada; la lee el módulo de API y la dibuja `App`. |

La regla que se aplicó: **el estado vive en el ancestro más bajo que es común a todos los que lo leen**.
`decisions` sube a `App` porque lo leen `Header` e `Inbox`; `query` se queda en `Inbox`; `typed` se queda
en `HashConfirm`; la ejecución se queda en `RunPanel`. Nada se subió «por si acaso» y no hay ninguna
copia duplicada del mismo dato.

## 7. Por qué esta interfaz no es la frontera de seguridad

La interfaz **ayuda a decidir bien, pero no decide nada de forma segura**. Las protecciones que se ven
en pantalla son barreras de usabilidad y de prevención de errores, no un control de acceso:

- Escribir el `plan_hash` o pulsar «Confirmar y aplicar» demuestra que la persona está prestando
  atención; no demuestra **quién** es ni que tenga permiso sobre el recurso.
- `HashConfirm` y el botón deshabilitado se pueden saltar desde las herramientas del navegador, desde
  la consola o llamando a la API directamente con `curl`. El estado de React es código en el cliente.
- Las decisiones guardadas en `localStorage` son solo una comodidad local: cualquiera puede editarlas o
  borrarlas, y no viajan firmadas a ningún sitio.
- La regla R2 de `useAgentRun` es una **segunda barrera** (defensa en profundidad): evita que un clic
  accidental aplique un cambio destructivo, pero si el servidor confiara en el `status` del cliente,
  bastaría con enviar la petición a mano.
- La red de este laboratorio es simulada (`src/lib/api.js`): no hay autenticación ni autorización
  detrás. Que la app «se comporte» no dice nada del servidor.

El límite real está en el servidor (como en la pasarela de la semana 8):

1. Autenticar a la persona (token de sesión) y autorizarla por operación y por recurso.
2. **Recalcular** el `plan_hash` en el servidor a partir de `op`, ruta y `target`, y rechazar si no
   coincide con el que se aprobó: así el agente no puede cambiar el destino después de la aprobación.
3. Exigir que la aprobación de un R2 quede registrada en el servidor con la identidad de quien aprobó,
   la fecha y el hash; no aceptar un «aprobado» que venga del cliente.
4. Aplicar la operación de forma idempotente y auditable, y limitar el daño (permisos mínimos, copias,
   listas de lo permitido).
5. Validar y tratar el contenido de terceros como **datos**, nunca como instrucciones ni como HTML
   (el plan `P-02` trae texto hostil a propósito).

En resumen: la interfaz sirve para que la persona vea los tres estados y decida con información; la
seguridad la impone el servidor aunque el cliente esté modificado.

## 8. Tabla de uso de IA

Se usó un asistente con acceso al repositorio (el contrato `AGENTS.md`), en turnos de un archivo. La
columna «evidencia» apunta al comando y a la salida guardada.

| # | Qué se pidió | Qué respondió | Decisión | Por qué | Evidencia |
|---|---|---|---|---|---|
| 1 | Implementar `src/hooks/useDebounce.js` con temporizador y limpieza | Hook con `useState` + un `useEffect` que crea y limpia su propio `setTimeout` | **Aceptado** | Las 10 pruebas del hook pasan, incluida la de temporizadores vivos al desmontar | `npm test -- useDebounce` → 10 passed. [`04-useDebounce-verde.txt`](evidencias/04-useDebounce-verde.txt) |
| 2 | Implementar `src/hooks/usePlans.js` con los tres estados, `reload` y descarte de respuestas viejas | Primera versión con los tres estados y `reload`, **sin** bandera de cancelación | **Rechazado** | 4 de 12 pruebas fallan en la carrera de peticiones; una respuesta lenta pisa a la nueva | `npm test -- usePlans` → 4 failed / 8 passed. [`03-rechazo-usePlans-v1.txt`](evidencias/03-rechazo-usePlans-v1.txt) y diff en 8.2 |
| 3 | Corregir `usePlans` para ignorar la respuesta vieja | Segunda versión con `cancelled` + limpieza del efecto | **Aceptado** | 12/12 en verde, incluidas `StrictMode`, cambio de `fetchPlans` y desmontaje | `npm test -- usePlans` → 12 passed. [`05-usePlans-verde.txt`](evidencias/05-usePlans-verde.txt) |
| 4 | Implementar `src/hooks/useAgentRun.js` (máquina de estados, R2, `AbortSignal`, desmontaje) | Hook con un solo estado, refs para el estado más reciente y el controlador, y barrera R2 | **Aceptado** | 18/18 en verde, incluida «approve() mientras corre no salta la barrera» | `npm test -- useAgentRun` → 18 passed. [`06-useAgentRun-verde.txt`](evidencias/06-useAgentRun-verde.txt) |
| 5 | Arreglar el fallo 1 en `src/ai/useDebounce.js` | Un solo efecto con limpieza por corrida | **Aceptado** | Pasan las 5 que fallaban y ninguna otra se rompe | `npm run test:ai` → 15 failed / 42 passed. [`08-ai-tras-fallo-1.txt`](evidencias/08-ai-tras-fallo-1.txt) |
| 6 | Arreglar los fallos 2 y 3 en `src/ai/usePlans.js` | `setError` en el rechazo + bandera `cancelled` con limpieza | **Aceptado** | Se resuelve el estado de error y las tres carreras; `App` deja de fallar | `npm run test:ai` → 9 failed / 48 passed. [`09-ai-tras-fallos-2-3.txt`](evidencias/09-ai-tras-fallos-2-3.txt) |
| 7 | Arreglar los fallos 4, 5 y 6 en `src/ai/useAgentRun.js` | Hooks incondicionales, efecto de aborto al desmontar y `plan.risk === "R2" ? "awaiting_approval" : "done"` | **Aceptado** | 57/57 en verde; se restaura la barrera de seguridad | `npm run test:ai` → 57 passed. [`10-despues-ai.txt`](evidencias/10-despues-ai.txt) |
| 8 | Propuesta de diseño: «pasa la lista de planes a `Header` para que calcule el contador él mismo» | La cabecera recibiría `plans` y contaría | **Rechazado** | Sube el estado y acopla `Header` a la forma del plan: el contador ya se deriva en `App` y la cabecera solo necesita un número. Rompe la regla del ancestro más bajo y hace que la cabecera se redibuje con cada plan | `App.test.jsx` → «la cabecera solo necesita un número: se dibuja sin la lista de planes» (pasa con el diseño actual); `Header.jsx` recibe `pendingCount` |

### 8.1 El pedido que se rechazó, con su diff

El caso 2 es el rechazo con diff. La versión 1 resolvía los tres estados pero no la carrera; el diff
contra la versión aceptada (resumido) es:

```diff
--- a/src/hooks/usePlans.js (v1, rechazada)
+++ b/src/hooks/usePlans.js (v2, aceptada)
@@
   useEffect(() => {
+    let cancelled = false;
+
     setStatus("loading");
     setPlans([]);
     setError(null);
 
     fetchPlans().then(
       (data) => {
+        if (cancelled) return;
         setPlans(data);
         setStatus("ready");
       },
       (err) => {
+        if (cancelled) return;
         setError(err);
         setStatus("error");
       }
     );
+
+    return () => {
+      cancelled = true;
+    };
   }, [fetchPlans, attempt]);
```

El diff completo está en [`evidencias/diferencias/rechazo-usePlans.diff`](evidencias/diferencias/rechazo-usePlans.diff).
Los diffs de los arreglos de la IA están en
[`ai-useDebounce.diff`](evidencias/diferencias/ai-useDebounce.diff),
[`ai-usePlans.diff`](evidencias/diferencias/ai-usePlans.diff) y
[`ai-useAgentRun.diff`](evidencias/diferencias/ai-useAgentRun.diff).

## 9. Bitácora por turno

| Turno | Archivo tocado | Pruebas antes | Pruebas después |
|---|---|---|---|
| 1 | `src/hooks/useDebounce.js` | 5/10 fallan | 0/10 |
| 2 | `src/hooks/usePlans.js` (v1) | — | 4/12 fallan → rechazado |
| 3 | `src/hooks/usePlans.js` (v2) | 4/12 fallan | 0/12 |
| 4 | `src/hooks/useAgentRun.js` | 14/18 fallan | 0/18 |
| 5 | (suite completa `src/hooks`) | 40/57 fallan | 0/57 |
| 6 | `src/ai/useDebounce.js` | 20/57 fallan | 15/57 |
| 7 | `src/ai/usePlans.js` | 15/57 fallan | 9/57 |
| 8 | `src/ai/useAgentRun.js` | 9/57 fallan | 0/57 |
| 9 | `ENTREGABLE-S11.md` y `evidencias/` | 0/57 | 0/57 (documentación) |

## 10. Nota de entorno

La máquina donde se hizo el trabajo no tenía Node en el `PATH`. Se usó una copia portátil de
**Node v22.23.5** (LTS) fuera del repositorio, sin instalar nada dentro del proyecto ni tocar
`package.json`, `vite.config.js` ni `.env.*`. Para reproducir el entregable en otra máquina hace falta
Node 20.19+ o 22.12+ y ejecutar `npm install` antes de las pruebas.

## 11. Commits y enlace

Rama: `lab11-extra-hooks-del-agente` del repositorio
<https://github.com/scarita-dev/cinemax-lab10-componentes-eventos>.

| Commit | Qué guarda |
|---|---|
| `9736fea` | **Estado original**: plantilla con los tres `TODO` en `src/hooks` y los tres hooks de la IA en `src/ai` sin arreglar (40 fallos en `npm test`, 20 en `npm run test:ai`) |
| `18a2c30` | `useDebounce`, `usePlans` y `useAgentRun` implementados (57/57 en `npm test`) |
| `e309317` | Los seis fallos de `src/ai` corregidos (57/57 en `npm run test:ai`) |
| (commit de este documento) | Entregable, evidencias y diffs |

La rama es independiente: **no se fusionó** con `main` ni con `lab11-comunicacion-componentes`.
