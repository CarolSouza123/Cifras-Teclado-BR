// GET  /api/stats?key=&from=YYYY-MM-DD&to=YYYY-MM-DD&campaign=
//   → devolve os blobs diários do funil, os lançamentos manuais e a lista de campanhas.
// POST /api/stats  { key, date, campaign, spend, revenue }
//   → salva/atualiza o lançamento manual (gasto/receita) do dia+campanha.
// Protegido pela variável de ambiente ADMIN_KEY. Dados no KV (binding TRACK_KV).

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

interface EventCounts {
  pageview: number
  sample_click: number
  checkout_click: number
}

interface DayBlob {
  campaigns: Record<string, EventCounts>
  hours: Record<string, number[]>
}

interface ManualEntry {
  spend: number
  revenue: number
}

type ManualDay = Record<string, ManualEntry>
type ManualMap = Record<string, ManualDay>

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const MAX_RANGE_DAYS = 400

const json = (status: number, data: unknown) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })

function checkAccess(context: PagesContext, providedKey: string | null): Response | null {
  if (!context.env.ADMIN_KEY) {
    return json(503, { ok: false, error: 'ADMIN_KEY não definida nas variáveis do projeto Cloudflare Pages.' })
  }
  if (!providedKey || providedKey !== context.env.ADMIN_KEY) {
    return json(401, { ok: false, error: 'Chave de acesso inválida.' })
  }
  if (!context.env.TRACK_KV) {
    return json(501, { ok: false, error: 'TRACK_KV não vinculado a este projeto Cloudflare Pages.' })
  }
  return null
}

function eachDate(from: string, to: string): string[] {
  const dates: string[] = []
  const cursor = new Date(`${from}T12:00:00Z`)
  const end = new Date(`${to}T12:00:00Z`)
  if (Number.isNaN(cursor.getTime()) || Number.isNaN(end.getTime()) || cursor > end) return dates
  while (cursor <= end && dates.length < MAX_RANGE_DAYS) {
    dates.push(cursor.toISOString().slice(0, 10))
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return dates
}

function parseJson<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function filterBlob(blob: DayBlob, campaign: string | null): DayBlob {
  if (!campaign || campaign === 'todas') return blob
  const out: DayBlob = { campaigns: {}, hours: {} }
  if (blob.campaigns[campaign]) out.campaigns[campaign] = blob.campaigns[campaign]
  if (blob.hours[campaign]) out.hours[campaign] = blob.hours[campaign]
  return out
}

function filterManual(manual: ManualMap, campaign: string | null): ManualMap {
  if (!campaign || campaign === 'todas') return manual
  const out: ManualMap = {}
  for (const [date, entries] of Object.entries(manual)) {
    if (entries[campaign]) out[date] = { [campaign]: entries[campaign] }
  }
  return out
}

export async function onRequestGet(context: PagesContext): Promise<Response> {
  const url = new URL(context.request.url)
  const denied = checkAccess(context, url.searchParams.get('key'))
  if (denied) return denied

  const today = new Date().toISOString().slice(0, 10)
  const fromParam = url.searchParams.get('from') || ''
  const toParam = url.searchParams.get('to') || ''
  const from = DATE_RE.test(fromParam) ? fromParam : today
  const to = DATE_RE.test(toParam) ? toParam : from
  const campaign = url.searchParams.get('campaign')

  const kv = context.env.TRACK_KV as KVNamespaceLike
  const days: Record<string, DayBlob> = {}
  const manual: ManualMap = {}
  const campaignSet = new Set<string>()

  for (const date of eachDate(from, to)) {
    const blob = parseJson<DayBlob>(await kv.get(`day:${date}`))
    if (blob) {
      Object.keys(blob.campaigns ?? {}).forEach(name => campaignSet.add(name))
      days[date] = filterBlob({ campaigns: blob.campaigns ?? {}, hours: blob.hours ?? {} }, campaign)
    }
    const manualDay = parseJson<ManualDay>(await kv.get(`manual:${date}`))
    if (manualDay) {
      Object.keys(manualDay).forEach(name => campaignSet.add(name))
      manual[date] = manualDay
    }
  }

  return json(200, {
    ok: true,
    from,
    to,
    days,
    manual: filterManual(manual, campaign),
    campaigns: [...campaignSet].sort(),
  })
}

export async function onRequestPost(context: PagesContext): Promise<Response> {
  const url = new URL(context.request.url)
  let body: Record<string, unknown> = {}
  try {
    body = (await context.request.json()) as Record<string, unknown>
  } catch {
    return json(400, { ok: false, error: 'JSON inválido.' })
  }

  const keyFromBody = typeof body.key === 'string' ? body.key : null
  const denied = checkAccess(context, url.searchParams.get('key') || keyFromBody)
  if (denied) return denied

  const date = typeof body.date === 'string' ? body.date : ''
  if (!DATE_RE.test(date)) return json(400, { ok: false, error: 'Data inválida (use AAAA-MM-DD).' })

  const campaignRaw = typeof body.campaign === 'string' ? body.campaign.trim().slice(0, 120) : ''
  const campaign = campaignRaw || 'direto'

  const spend = Number(body.spend)
  const revenue = Number(body.revenue)
  if (!Number.isFinite(spend) || spend < 0 || !Number.isFinite(revenue) || revenue < 0) {
    return json(400, { ok: false, error: 'Gasto e receita devem ser números maiores ou iguais a zero.' })
  }

  const kv = context.env.TRACK_KV as KVNamespaceLike
  const kvKey = `manual:${date}`
  const existing = parseJson<ManualDay>(await kv.get(kvKey)) ?? {}
  existing[campaign] = { spend, revenue }
  await kv.put(kvKey, JSON.stringify(existing))

  return json(200, { ok: true, date, manual: existing })
}
