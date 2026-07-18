export function DevicePanel({ sim }) {
  const {
    powered,
    mode,
    scanning,
    channels,
    devices,
    selectedId,
    setSelectedId,
    soundOn,
    setSoundOn,
    log,
    powerOn,
    powerOff,
    enterDiag,
    enterSilence,
    toggleSilence,
  } = sim

  return (
    <section className="device-section" id="dispositivo" aria-label="Dispositivo Pocket Silence">
      <div className="device-shell">
        <div className="device-bezel">
          <header className="device-top">
            <div className="brand-mark">
              <span className="brand-mark__name">Pocket Silence</span>
              <span className="brand-mark__ver">CS-1 · caso de estudio</span>
            </div>
            <div className="leds" aria-hidden="true">
              <span className={`led led--power ${powered ? 'is-on' : ''}`} title="Alimentación" />
              <span
                className={`led led--op ${powered && mode !== 'idle' ? 'is-on' : ''} ${mode === 'silence' ? 'is-alert' : ''}`}
                title="Operación"
              />
            </div>
          </header>

          <div className={`screen ${powered ? 'is-live' : 'is-off'}`}>
            {!powered ? (
              <p className="screen-off">USB-C · 5V · listo para encender</p>
            ) : (
              <>
                <div className="screen-meta">
                  <span>2.4 GHz</span>
                  <span>{mode === 'diag' ? 'DIAG' : mode === 'silence' ? 'MODO S' : 'STANDBY'}</span>
                  <span>{scanning ? 'SCAN…' : 'OK'}</span>
                </div>

                <div className="channel-row" aria-label="Congestión de canales Bluetooth">
                  {channels.map((ch) => (
                    <div key={ch.id} className="channel">
                      <div className="channel__bar" style={{ height: `${Math.round(ch.load * 100)}%` }} />
                      <span>{ch.label}</span>
                    </div>
                  ))}
                </div>

                <ul className="device-list">
                  {devices.length === 0 && (
                    <li className="device-list__empty">
                      {mode === 'diag'
                        ? scanning
                          ? 'Buscando dispositivos en pair…'
                          : 'Sin resultados aún — iniciá el escaneo'
                        : mode === 'silence'
                          ? 'Elegí un parlante Classic para silenciar (simulado)'
                          : 'Elegí Diagnóstico o Modo S'}
                    </li>
                  )}
                  {devices.map((device) => (
                    <li key={device.id}>
                      <button
                        type="button"
                        className={`device-row ${selectedId === device.id ? 'is-selected' : ''} ${device.silenced ? 'is-silenced' : ''}`}
                        onClick={() => {
                          setSelectedId(device.id)
                          if (mode === 'silence') toggleSilence(device.id)
                        }}
                      >
                        <span className="device-row__name">{device.name}</span>
                        <span className="device-row__mac">{device.mac}</span>
                        <span className="device-row__meta">
                          {device.classic ? 'Classic' : 'LE'} · RSSI {device.rssi}
                          {device.silenced ? ' · S' : ''}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="log" aria-live="polite">
                  {log.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="controls">
            <button
              type="button"
              className={`ctrl ctrl--power ${powered ? 'is-active' : ''}`}
              onClick={() => (powered ? powerOff() : powerOn())}
            >
              {powered ? 'Apagar' : 'Encender'}
            </button>
            <button
              type="button"
              className={`ctrl ${mode === 'diag' ? 'is-active' : ''}`}
              onClick={enterDiag}
              disabled={!powered}
            >
              Diagnóstico
            </button>
            <button
              type="button"
              className={`ctrl ctrl--s ${mode === 'silence' ? 'is-active' : ''}`}
              onClick={enterSilence}
              disabled={!powered}
            >
              Modo S
            </button>
            <button
              type="button"
              className="ctrl ctrl--ghost"
              onClick={() => setSoundOn((v) => !v)}
              disabled={!powered}
              aria-pressed={soundOn}
            >
              Audio {soundOn ? 'on' : 'off'}
            </button>
          </div>

          <p className="device-note">
            Simulación local en el navegador. No transmite, no jamea ni interfiere con radios reales.
          </p>
        </div>
      </div>
    </section>
  )
}
