# Pocket Silence

**El salvador de los oídos** — caso de estudio digital y lúdico.

Simulación web inspirada en [Pocket Gone](https://pocketgone.com/): diagnóstico de dispositivos Bluetooth (nombre, MAC, RSSI, congestión de canales) y un **Modo S** jugable que silencia parlantes del escenario sonoro local.

## Qué es (y qué no es)

- Es material educativo / de diseño, no un producto a la venta.
- Corre entero en el navegador: síntesis de audio + UI.
- **No** transmite RF, **no** jamea, **no** interfiere con Bluetooth real.

## Cómo correrlo

```bash
npm install
npm run dev
```

Build de producción:

```bash
npm run build
npm run preview
```

## Flujo de la simulación

1. **Encender** el dispositivo.
2. **Diagnóstico** — escanea dispositivos simulados en pair y grafica canales 2.4 GHz.
3. **Modo S** — activa el campo sonoro de estudio; tocá un parlante Classic para silenciarlo / restaurarlo.
4. Usá **Audio on/off** si preferís la demo en silencio.

## Créditos

Inspirado en el taller y la documentación pública de Pocket Gone. Pocket Silence no está afiliado comercialmente; es un ejercicio de caso de estudio.
