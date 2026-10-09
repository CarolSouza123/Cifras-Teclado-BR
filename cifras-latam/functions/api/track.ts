// POST /api/track — recebe eventos do funil e agrega por dia no KV.
// Sem PII: não armazenamos IP, user-agent nem identificadores individuais.

interface KVNamespaceLike {
  get(key: string): Promise<string | null>
  put(key: string, value: string): Promise<void>
}

interface Env {
  TRACK_KV?: KVNamespaceLike
  ADMIN_KEY?: string
}

interface PagesContext {
  request: Request
  env: Env
}

type EventType = 'pageview' | 'sample_click' | 'checkout_click'

interface EventCounts {
  pageview: number
  sample_click: number
  checkout_click: number
}

interface DayBlob {
  campaigns: Record<string, EventCounts>
  hours: Record<string, number[]>
}

const TIME_ZONE = 'America/Sao_Paulo'
const WEEKDAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
const VALID_EVENTS: EventType[] = ['pageview', 'sample_click', 'checkout_click']

const emptyCounts = (): EventCounts => ({ pageview: 0, sample_click: 0, checkout_click: 0 })
const emptyHours = (): number[] => Array.from({ length: 168 }, () => 0)

const emptyBlob = (): DayBlob => ({ campaigns: {}, hours: {} })

function parseBlob(raw: string | null): DayBlob {
  if (!raw) return emptyBlob()
  try {
    const parsed = JSON.parse(raw) as Partial<DayBlob>
    const blob = emptyBlob()
    if (parsed.campaigns && typeof parsed.campaigns === 'object') {
      for (const [name, counts] of Object.entries(parsed.campaigns)) {
        blob.campaigns[name] = {
          pageview: Number(counts?.pageview) || 0,
          sample_click: Number(counts?.sample_click) || 0,
          checkout_click: Number(counts?.checkout_click) || 0,
        }
      }
    }
    if (parsed.hours && typeof parsed.hours === 'object') {
      for (const [name, arr] of Object.entries(parsed.hours)) {
        const hours = emptyHours()
        if (Array.isArray(arr)) arr.slice(0, 168).forEach((value, index) => { hours[index] = Number(value) || 0 })
        blob.hours[name] = hours
      }
    }
    return blob
  } catch {
    return emptyBlob()
  }
}

function saoPauloParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
    weekday: 'short',
  }).formatToParts(date)
  const get = (type: string) => parts.find(part => part.type === type)?.value ?? ''
  return {
    dayKey: `${get('year')}-${get('month')}-${get('day')}`,
    weekday: WEEKDAY_INDEX[get('weekday')] ?? 0,
    hour: (parseInt(get('hour'), 10) || 0) % 24,
  }
}

function sanitizeCampaign(value: unknown): string {
  if (typeof value !== 'string') return 'direto'
  const clean = value.trim().slice(0, 120)
  return clean || 'direto'
}

const json = (status: number, data: unknown) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })

export async function onRequestPost(context: PagesContext): Promise<Response> {
  const kv = context.env.TRACK_KV
  if (!kv) return json(501, { ok: false, error: 'TRACK_KV não vinculado a este projeto.' })

  let payload: Record<string, unknown>
  try {
    payload = (await context.request.json()) as Record<string, unknown>
  } catch {
    return json(400, { ok: false, error: 'JSON inválido.' })
  }

  const event = payload.event as EventType
  if (!VALID_EVENTS.includes(event)) return json(400, { ok: false, error: 'Evento inválido.' })

  const utm = (payload.utm && typeof payload.utm === 'object' ? payload.utm : {}) as Record<string, unknown>
  const campaign = sanitizeCampaign(utm.campaign)

  const parsedTs = typeof payload.ts === 'string' ? new Date(payload.ts) : new Date()
  const when = Number.isNaN(parsedTs.getTime()) ? new Date() : parsedTs
  const { dayKey, weekday, hour } = saoPauloParts(when)
  const kvKey = `day:${dayKey}`

  try {
    const blob = parseBlob(await kv.get(kvKey))
    const counts = blob.campaigns[campaign] ?? emptyCounts()
    counts[event] += 1
    blob.campaigns[campaign] = counts
    if (event === 'pageview') {
      const hours = blob.hours[campaign] ?? emptyHours()
      hours[weekday * 24 + hour] += 1
      blob.hours[campaign] = hours
    }
    await kv.put(kvKey, JSON.stringify(blob))
  } catch {
    return json(500, { ok: false, error: 'Falha ao gravar o evento.' })
  }

  return new Response(null, { status: 204 })
}
