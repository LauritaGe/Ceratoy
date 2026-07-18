/** Dispositivos Bluetooth Classic simulados — solo caso de estudio. */
export const MOCK_DEVICES = [
  {
    id: 'spk-01',
    name: 'JBL Flip Street',
    mac: 'A4:C1:38:7B:2E:91',
    type: 'speaker',
    classic: true,
    channel: 37,
    baseRssi: -48,
    tone: { freq: 110, pattern: 'boom' },
  },
  {
    id: 'spk-02',
    name: 'Tronsmart Party',
    mac: '00:1A:7D:DA:71:13',
    type: 'speaker',
    classic: true,
    channel: 39,
    baseRssi: -62,
    tone: { freq: 146.8, pattern: 'party' },
  },
  {
    id: 'spk-03',
    name: 'Xiaomi Mi Speaker',
    mac: 'F8:24:41:3C:90:AA',
    type: 'speaker',
    classic: true,
    channel: 38,
    baseRssi: -71,
    tone: { freq: 98, pattern: 'thin' },
  },
  {
    id: 'phn-01',
    name: 'Pixel_pair_mode',
    mac: '3C:5A:B4:12:88:0F',
    type: 'phone',
    classic: true,
    channel: 37,
    baseRssi: -55,
    tone: null,
  },
  {
    id: 'hd-01',
    name: 'AirPods_LE',
    mac: '7C:04:D0:9E:44:21',
    type: 'headphones',
    classic: false,
    channel: 0,
    baseRssi: -68,
    tone: null,
  },
]

export const BT_CHANNELS = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  label: String(i).padStart(2, '0'),
}))

export function congestionForChannel(channel, tick) {
  const wave = Math.sin(tick / 8 + channel * 0.7) * 0.35
  const base = [0.2, 0.55, 0.35, 0.8, 0.45, 0.3, 0.7, 0.25, 0.5, 0.9, 0.4, 0.6, 0.35, 0.75, 0.3, 0.5][
    channel
  ]
  return Math.min(1, Math.max(0.08, base + wave))
}

export function liveRssi(baseRssi, tick, idSeed) {
  const wobble = Math.sin(tick / 5 + idSeed) * 4 + Math.sin(tick / 2.3 + idSeed * 1.7) * 2
  return Math.round(baseRssi + wobble)
}
