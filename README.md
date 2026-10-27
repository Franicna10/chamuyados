# Chamuyados

Chamuyados es un videojuego web de preguntas sobre chamuyo, chats, primeras citas y vínculos. Con situaciones cotidianas en tono argentino, quien juega decide si cada conducta es **Chamuyo**, **Red flag** o **Green flag**. La propuesta es lúdica y respetuosa: invita a conversar sobre límites, comunicación y cuidado, sin presentar una respuesta como regla para todos los vínculos.

## Público y contenido

Está pensado para personas jóvenes que quieran jugar una ronda breve y compartir situaciones reconocibles. No requiere una cuenta ni envía el historial a un servidor.

Se puede elegir entre siete categorías:

- Chamuyo inicial
- Red o Green Flag
- Chat y redes
- Primera cita
- ¿Qué responderías?
- Frases chamuyeras
- Modo íconos argentinos

Cada categoría tiene al menos diez situaciones; una ronda selecciona diez al azar y sin repetir dentro de esa ronda. Las situaciones son originales y no se atribuyen a personas reales. El modo íconos argentinos conserva su identidad local sin depender de citas.

## Mecánica

1. Armá tu perfil y elegí el modo Solo.
2. Elegí una categoría e iniciá una ronda de diez preguntas.
3. Tenés **60 segundos para toda la partida**. El reloj corre también mientras leés las devoluciones y no se reinicia al cambiar de pregunta.
4. Elegí Chamuyo, Red flag o Green flag. Cada acierto suma 100 puntos; una pregunta respondida no puede puntuarse dos veces.
5. Después de cada respuesta se muestran la opción correcta y una explicación breve.
6. Al completar la ronda o agotarse el tiempo, se informa el puntaje, respuestas correctas e incorrectas, preguntas sin responder, promedio de aciertos y rango.

El promedio es el porcentaje de aciertos sobre las preguntas respondidas; las preguntas no respondidas se informan aparte. El ranking se arma con partidas reales guardadas en el `localStorage` del navegador actual, ordenadas por puntaje. No es un ranking compartido entre dispositivos.

## Tecnologías

- React 19 y TypeScript
- Vite
- React Router (`createBrowserRouter` / `RouterProvider`)
- CSS existente de Chamuyados, conservando gradientes, tarjetas con glassmorfismo y paleta violeta/fucsia
- `localStorage` para guardar el ranking local

La aplicación usa Vite como único entorno de ejecución; Next/Vinext ya no participa del ruteo ni del build.

## Rutas

| Ruta | Pantalla |
| --- | --- |
| `/` | Inicio |
| `/profile` | Perfil |
| `/help` | Ayuda |
| `/ranking` | Ranking local |
| `/mode` | Modo Solo |
| `/categories` | Categorías |
| `/game/question` | Pregunta |
| `/game/feedback` | Devolución |
| `/result` | Resultado |

Las rutas de partida comparten el estado del juego en el shell de React Router. React Router también integra el historial del navegador para volver y avanzar. `vercel.json` configura el fallback de rutas SPA para que las URLs directas se sirvan desde `index.html`.

## Instalación y desarrollo

Se requiere Node.js `>=22.13.0` y pnpm `11.25.0` (incluido mediante Corepack).

```bash
corepack pnpm install
corepack pnpm dev
```

Vite muestra la URL local en la terminal.

## Verificaciones y compilación

```bash
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm build
corepack pnpm preview
```

El build genera el sitio estático en `dist/`. No hay una suite de pruebas automatizadas configurada en este proyecto; la prueba con una persona externa está pendiente y tiene un guion en [`docs/prueba-usabilidad.md`](./docs/prueba-usabilidad.md).

## Despliegue en Vercel

1. Subí los cambios a una rama del repositorio y conectá el repositorio en Vercel.
2. Elegí el preset Vite o configurá el comando de build `corepack pnpm build` y el directorio de salida `dist`.
3. Desplegá y comprobá tanto la página inicial como una ruta directa, por ejemplo `/game/question`.
4. Abrí el enlace desde otro dispositivo y completá el checklist en [`docs/checklist-entrega-momento-3.md`](./docs/checklist-entrega-momento-3.md).

El despliegue no se realizó desde esta tarea.

## Uso de IA en el proceso

Durante esta iteración se usó asistencia de IA para inspeccionar la estructura existente y ayudar a implementar la migración de navegación a React Router, corregir la duración y continuidad del temporizador, agregar el cálculo de resultados y el ranking local, redactar situaciones originales y preparar documentación de entrega. La asistencia no reemplaza la revisión del código ni una prueba externa: esa prueba, el despliegue y la publicación en Instagram siguen pendientes. No se atribuyen entrevistas, mediciones de usabilidad ni resultados que no se hayan realizado.

## Entrega

- Guion y espacios de registro para prueba externa: [`docs/prueba-usabilidad.md`](./docs/prueba-usabilidad.md)
- Checklist de tareas que faltan para completar la entrega: [`docs/checklist-entrega-momento-3.md`](./docs/checklist-entrega-momento-3.md)
- Guion breve de presentación: [`docs/presentacion-momento-3.md`](./docs/presentacion-momento-3.md)
