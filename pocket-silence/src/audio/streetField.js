/**
 * Campo sonoro lúdico: simula parlantes Bluetooth molestos en el entorno.
 * Todo es síntesis local — no hay transmisión ni interferencia real.
 */

function createNoiseBuffer(ctx, seconds = 1) {
  const length = ctx.sampleRate * seconds
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * 0.35
  }
  return buffer
}

function makeSpeakerVoice(ctx, master, tone) {
  const gain = ctx.createGain()
  gain.gain.value = 0
  gain.connect(master)

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = tone.pattern === 'party' ? 900 : tone.pattern === 'thin' ? 1400 : 600
  filter.Q.value = 0.7
  filter.connect(gain)

  const oscA = ctx.createOscillator()
  const oscB = ctx.createOscillator()
  oscA.type = 'sawtooth'
  oscB.type = 'square'
  oscA.frequency.value = tone.freq
  oscB.frequency.value = tone.freq * 1.5
  oscA.connect(filter)
  oscB.connect(filter)

  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.frequency.value = tone.pattern === 'party' ? 2.2 : 1.1
  lfoGain.gain.value = tone.pattern === 'boom' ? 18 : 8
  lfo.connect(lfoGain)
  lfoGain.connect(oscA.frequency)

  const noise = ctx.createBufferSource()
  noise.buffer = createNoiseBuffer(ctx)
  noise.loop = true
  const noiseGain = ctx.createGain()
  noiseGain.gain.value = tone.pattern === 'thin' ? 0.04 : 0.08
  noise.connect(noiseGain)
  noiseGain.connect(filter)

  oscA.start()
  oscB.start()
  lfo.start()
  noise.start()

  return {
    gain,
    setPlaying(playing, now = ctx.currentTime) {
      gain.gain.cancelScheduledValues(now)
      gain.gain.setValueAtTime(gain.gain.value, now)
      gain.gain.linearRampToValueAtTime(playing ? 0.12 : 0, now + 0.35)
    },
    setSilenced(silenced, now = ctx.currentTime) {
      gain.gain.cancelScheduledValues(now)
      gain.gain.setValueAtTime(gain.gain.value, now)
      gain.gain.linearRampToValueAtTime(silenced ? 0 : 0.12, now + 0.2)
    },
  }
}

export function createStreetField() {
  let ctx = null
  let master = null
  let voices = new Map()
  let started = false

  function ensure() {
    if (ctx) return
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    ctx = new AudioCtx()
    master = ctx.createGain()
    master.gain.value = 0.55
    master.connect(ctx.destination)

    const hum = ctx.createOscillator()
    const humGain = ctx.createGain()
    hum.type = 'sine'
    hum.frequency.value = 55
    humGain.gain.value = 0.02
    hum.connect(humGain)
    humGain.connect(master)
    hum.start()
  }

  return {
    async start(devices) {
      ensure()
      if (ctx.state === 'suspended') await ctx.resume()
      started = true

      for (const device of devices) {
        if (!device.tone || voices.has(device.id)) continue
        const voice = makeSpeakerVoice(ctx, master, device.tone)
        voices.set(device.id, voice)
        voice.setPlaying(true)
      }
    },
    silence(deviceId, on) {
      const voice = voices.get(deviceId)
      if (!voice || !started) return
      voice.setSilenced(on)
    },
    setMuted(muted) {
      if (!master || !ctx) return
      const now = ctx.currentTime
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(master.gain.value, now)
      master.gain.linearRampToValueAtTime(muted ? 0 : 0.55, now + 0.2)
    },
    isStarted() {
      return started
    },
  }
}
