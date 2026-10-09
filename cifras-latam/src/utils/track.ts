// Rastreador de eventos do funil (painel /admin).
// Espelha a leitura de UTMs de src/utils/attribution.ts (mesma chave de
// localStorage) sem alterar aquele arquivo. Todas as falhas são silenciosas:
// o rastreamento nunca pode quebrar a página.

const ATTRIBUTION_KEY = 'lowticket_attribution'
const SESSION_KEY = 'cs_sid'
const TRACK_ENDPOINT = '/api/track'

export type TrackEventType = 'pageview' | 'sample_click' | 'checkout_click'
export type TrackPlan = 'simples' | 'completa'
export type TrackSource = 'card' | 'modal'

export interface TrackOptions {
  plan?: TrackPlan | null
  source?: TrackSource | null
}

interface UtmSet {
  source: string
  medium: string
  campaign: string
  content: string
  term: string
}

const readUtms = (): UtmSet => {
  const empty: UtmSet = { source: '', medium: '', campaign: '', content: '', term: '' }
  try {
    const stored = JSON.parse(window.localStorage.getItem(ATTRIBUTION_KEY) || '{}') as Record<string, unknown>
    return {
      source: typeof stored.utm_source === 'string' ? stored.utm_source : '',
      medium: typeof stored.utm_medium === 'string' ? stored.utm_medium : '',
      campaign: typeof stored.utm_campaign === 'string' ? stored.utm_campaign : '',
      content: typeof stored.utm_content === 'string' ? stored.utm_content : '',
      term: typeof stored.utm_term === 'string' ? stored.utm_term : '',
    }
  } catch {
    return empty
  }
}

const getSessionId = (): string => {
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY)
    if (existing) return existing
    const id = typeof window.crypto?.randomUUID === 'function'
      ? window.crypto.randomUUID()
      : `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
    window.sessionStorage.setItem(SESSION_KEY, id)
    return id
  } catch {
    return ''
  }
}

const mirrorToPixel = (event: TrackEventType, utm: UtmSet, options: TrackOptions) => {
  try {
    if (typeof window.fbq !== 'function') return
    if (event === 'sample_click') {
      window.fbq('trackCustom', 'SampleDownload', { utm_campaign: utm.campaign })
    } else if (event === 'checkout_click') {
      window.fbq('trackCustom', 'CheckoutClick', {
        utm_campaign: utm.campaign,
        plan: options.plan ?? undefined,
        source: options.source ?? undefined,
      })
    }
  } catch {
    // Pixel é complementar; nunca bloquear o envio principal.
  }
}

export function trackEvent(event: TrackEventType, options: TrackOptions = {}) {
  try {
    const utm = readUtms()
    const payload = {
      event,
      ts: new Date().toISOString(),
      utm,
      plan: options.plan ?? null,
      source: options.source ?? null,
      path: window.location.pathname,
      sid: getSessionId(),
    }
    const body = JSON.stringify(payload)

    let sent = false
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        sent = navigator.sendBeacon(TRACK_ENDPOINT, new Blob([body], { type: 'application/json' }))
      }
    } catch {
      sent = false
    }
    if (!sent) {
      try {
        void fetch(TRACK_ENDPOINT, {
          method: 'POST',
          body,
          keepalive: true,
          headers: { 'Content-Type': 'application/json' },
        }).catch(() => undefined)
      } catch {
        // Sem rede/sem suporte: ignora.
      }
    }

    mirrorToPixel(event, utm, options)
  } catch {
    // Falha silenciosa por design.
  }
}

let pageviewSent = false

export function trackPageview() {
  if (pageviewSent) return
  pageviewSent = true
  trackEvent('pageview')
}
