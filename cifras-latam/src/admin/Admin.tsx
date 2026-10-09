import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import './admin.css'

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

type ManualMap = Record<string, Record<string, ManualEntry>>

interface StatsResponse {
  ok: boolean
  from: string
  to: string
  days: Record<string, DayBlob>
  manual: ManualMap
  campaigns: string[]
  error?: string
}

interface ManualRow {
  date: string
  campaign: string
  spend: number
  revenue: number
}

interface Aggregates {
  pageview: number
  sample: number
  checkout: number
  hours: number[]
  revenue: number
  spend: number
  entries: ManualRow[]
}

const ADMIN_KEY_STORAGE = 'cs_admin_key'
const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const DAY_NAMES_FULL = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']

const pad = (n: number) => String(n).padStart(2, '0')
const fmtDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const todayLocal = () => fmtDate(new Date())
const addDays = (dateStr: string, delta: number) => {
  const d = new Date(`${dateStr}T12:00:00`)
  d.setDate(d.getDate() + delta)
  return fmtDate(d)
}
const displayDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const intFmt = new Intl.NumberFormat('pt-BR')
const pctFmt = (value: number) => `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`

function aggregate(data: StatsResponse, campaign: string): Aggregates {
  const hours = new Array<number>(168).fill(0)
  let pageview = 0
  let sample = 0
  let checkout = 0
  let revenue = 0
  let spend = 0
  const entries: ManualRow[] = []

  for (const blob of Object.values(data.days)) {
    const names = campaign === 'todas' ? Object.keys(blob.campaigns ?? {}) : [campaign]
    for (const name of names) {
      const counts = blob.campaigns?.[name]
      if (!counts) continue
      pageview += counts.pageview || 0
      sample += counts.sample_click || 0
      checkout += counts.checkout_click || 0
      const byHour = blob.hours?.[name]
      if (Array.isArray(byHour)) byHour.forEach((value, index) => { if (index < 168) hours[index] += Number(value) || 0 })
    }
  }

  for (const [date, dayEntries] of Object.entries(data.manual ?? {})) {
    for (const [name, entry] of Object.entries(dayEntries)) {
      if (campaign !== 'todas' && name !== campaign) continue
      spend += entry.spend || 0
      revenue += entry.revenue || 0
      entries.push({ date, campaign: name, spend: entry.spend || 0, revenue: entry.revenue || 0 })
    }
  }
  entries.sort((a, b) => b.date.localeCompare(a.date) || a.campaign.localeCompare(b.campaign))

  return { pageview, sample, checkout, hours, revenue, spend, entries }
}

function buildDemoData(from: string, to: string): StatsResponse {
  const campaignNames = ['meta-ads-louvores', 'direto']
  const days: Record<string, DayBlob> = {}
  const manual: ManualMap = {}
  let cursor = from
  let i = 0
  while (cursor <= to && i < 62) {
    const dow = new Date(`${cursor}T12:00:00`).getDay()
    const blob: DayBlob = { campaigns: {}, hours: {} }
    for (const name of campaignNames) {
      const base = name === 'direto' ? 16 : 68
      const weekendBoost = dow === 0 || dow === 6 ? 1.45 : 1
      const wave = 0.8 + ((i * 37 + name.length * 13) % 40) / 100
      const pv = Math.round(base * weekendBoost * wave)
      blob.campaigns[name] = {
        pageview: pv,
        sample_click: Math.round(pv * 0.32),
        checkout_click: Math.round(pv * 0.11),
      }
      const hours = new Array<number>(168).fill(0)
      const weights: Array<[number, number]> = [[8, 3], [9, 4], [12, 2], [19, 6], [20, 8], [21, 6], [22, 3]]
      const totalWeight = weights.reduce((acc, [, w]) => acc + w, 0)
      let remaining = pv
      weights.forEach(([hour, weight], index) => {
        const value = index === weights.length - 1 ? remaining : Math.round((pv * weight) / totalWeight)
        hours[dow * 24 + hour] = value
        remaining -= value
      })
      blob.hours[name] = hours
    }
    days[cursor] = blob
    if (i % 2 === 0) {
      manual[cursor] = { 'meta-ads-louvores': { spend: 38 + (i % 5) * 7.5, revenue: 97.8 + (i % 4) * 37.9 } }
    }
    cursor = addDays(cursor, 1)
    i += 1
  }
  return { ok: true, from, to, days, manual, campaigns: campaignNames }
}

type Preset = 'hoje' | '7d' | '30d' | 'custom'

export default function Admin() {
  const [adminKey, setAdminKey] = useState<string>(() => {
    try {
      return window.sessionStorage.getItem(ADMIN_KEY_STORAGE) || ''
    } catch {
      return ''
    }
  })
  const [keyInput, setKeyInput] = useState('')
  const [keyError, setKeyError] = useState('')
  const [preset, setPreset] = useState<Preset>('7d')
  const [from, setFrom] = useState<string>(() => addDays(todayLocal(), -6))
  const [to, setTo] = useState<string>(() => todayLocal())
  const [campaign, setCampaign] = useState('todas')
  const [data, setData] = useState<StatsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [demo, setDemo] = useState(false)
  const [fDate, setFDate] = useState<string>(() => todayLocal())
  const [fCampaign, setFCampaign] = useState('')
  const [fSpend, setFSpend] = useState('')
  const [fRevenue, setFRevenue] = useState('')
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')

  const load = useCallback(async (key: string, f: string, t: string, camp: string) => {
    if (!key) return
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ key, from: f, to: t, campaign: camp })
      const res = await fetch(`/api/stats?${params.toString()}`)
      const body = (await res.json().catch(() => null)) as StatsResponse | null
      if (res.status === 401) {
        try {
          window.sessionStorage.removeItem(ADMIN_KEY_STORAGE)
        } catch { /* ignore */ }
        setAdminKey('')
        setData(null)
        setKeyError('Chave incorreta. Tente novamente.')
        return
      }
      if (!res.ok || !body || body.ok === false) {
        throw new Error(body?.error || 'A API de estatísticas não respondeu. Verifique se o KV TRACK_KV está vinculado e se a variável ADMIN_KEY está definida no Cloudflare Pages.')
      }
      setData(body)
    } catch (err) {
      setData(null)
      setError(err instanceof Error ? err.message : 'Não foi possível carregar os dados.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!demo && adminKey) void load(adminKey, from, to, campaign)
  }, [demo, adminKey, from, to, campaign, load])

  const demoData = useMemo(() => (demo ? buildDemoData(from, to) : null), [demo, from, to])
  const view = demo ? demoData : data
  const agg = useMemo(() => (view ? aggregate(view, campaign) : null), [view, campaign])

  const campaignOptions = useMemo(() => {
    const list = view?.campaigns ?? []
    return campaign !== 'todas' && !list.includes(campaign) ? [...list, campaign] : list
  }, [view, campaign])

  const applyPreset = (next: Preset) => {
    setPreset(next)
    const t = todayLocal()
    if (next === 'hoje') {
      setFrom(t)
      setTo(t)
    } else if (next === '7d') {
      setFrom(addDays(t, -6))
      setTo(t)
    } else if (next === '30d') {
      setFrom(addDays(t, -29))
      setTo(t)
    }
  }

  const handleLogin = (event: FormEvent) => {
    event.preventDefault()
    const key = keyInput.trim()
    if (!key) return
    setKeyError('')
    try {
      window.sessionStorage.setItem(ADMIN_KEY_STORAGE, key)
    } catch { /* ignore */ }
    setAdminKey(key)
  }

  const handleLogout = () => {
    try {
      window.sessionStorage.removeItem(ADMIN_KEY_STORAGE)
    } catch { /* ignore */ }
    setAdminKey('')
    setKeyInput('')
    setData(null)
    setDemo(false)
  }

  const handleSaveManual = async (event: FormEvent) => {
    event.preventDefault()
    setNotice('')
    if (demo) {
      setNotice('Modo demonstração: os lançamentos estão desativados.')
      return
    }
    const spend = Number.parseFloat(fSpend.replace(',', '.')) || 0
    const revenue = Number.parseFloat(fRevenue.replace(',', '.')) || 0
    const entryCampaign = fCampaign.trim() || 'direto'
    setSaving(true)
    try {
      const res = await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: adminKey, date: fDate, campaign: entryCampaign, spend, revenue }),
      })
      const body = (await res.json().catch(() => null)) as StatsResponse | null
      if (!res.ok || !body || body.ok === false) {
        throw new Error(body?.error || 'Não foi possível salvar o lançamento.')
      }
      setNotice('Lançamento salvo.')
      setFSpend('')
      setFRevenue('')
      void load(adminKey, from, to, campaign)
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Não foi possível salvar o lançamento.')
    } finally {
      setSaving(false)
    }
  }

  if (!adminKey && !demo) {
    return (
      <div className="adm-root">
        <div className="adm-login">
          <h1>Painel do funil</h1>
          <p className="adm-muted">Área restrita. Digite a chave de acesso definida no Cloudflare Pages (ADMIN_KEY).</p>
          <form onSubmit={handleLogin} className="adm-login-form">
            <label>
              Chave de acesso
              <input type="password" value={keyInput} onChange={event => setKeyInput(event.target.value)} autoComplete="off" placeholder="••••••••" />
            </label>
            {keyError && <p className="adm-error">{keyError}</p>}
            <button type="submit" className="adm-btn adm-btn-primary">Entrar</button>
          </form>
          <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setDemo(true)}>Ver demonstração</button>
        </div>
      </div>
    )
  }

  const steps = agg
    ? [
        { label: 'Visitas', value: agg.pageview },
        { label: 'Cliques na amostra', value: agg.sample },
        { label: 'Cliques no checkout', value: agg.checkout },
      ]
    : []
  const maxStep = Math.max(1, ...steps.map(step => step.value))
  const maxHour = agg ? Math.max(1, ...agg.hours) : 1
  const peakIndex = agg ? agg.hours.indexOf(Math.max(...agg.hours)) : -1
  const peakValue = agg && peakIndex >= 0 ? agg.hours[peakIndex] : 0
  const roas = agg && agg.spend > 0 ? (agg.revenue / agg.spend).toFixed(2).replace('.', ',') : '—'
  const ticket = agg && agg.checkout > 0 ? brl.format(agg.revenue / agg.checkout) : '—'
  const isEmpty = agg !== null && agg.pageview === 0 && agg.entries.length === 0

  return (
    <div className="adm-root">
      <header className="adm-header">
        <div>
          <h1>Painel do funil</h1>
          <p className="adm-muted">Coleção Suprema — visitas, amostra, checkout e retorno das campanhas</p>
        </div>
        <div className="adm-header-actions">
          {!demo && (
            <button type="button" className="adm-btn" onClick={() => void load(adminKey, from, to, campaign)} disabled={loading}>
              {loading ? 'Atualizando…' : 'Atualizar'}
            </button>
          )}
          {demo ? (
            <button type="button" className="adm-btn" onClick={() => setDemo(false)}>Sair da demonstração</button>
          ) : (
            <button type="button" className="adm-btn" onClick={handleLogout}>Sair</button>
          )}
        </div>
      </header>

      {demo && <div className="adm-demo-banner">MODO DEMONSTRAÇÃO — dados fictícios, apenas para visualizar o layout do painel.</div>}
      {error && !demo && <div className="adm-error-box">{error}</div>}

      <section className="adm-filters" aria-label="Filtros">
        <div className="adm-presets" role="group" aria-label="Período rápido">
          <button type="button" className={preset === 'hoje' ? 'adm-chip adm-chip-on' : 'adm-chip'} onClick={() => applyPreset('hoje')}>Hoje</button>
          <button type="button" className={preset === '7d' ? 'adm-chip adm-chip-on' : 'adm-chip'} onClick={() => applyPreset('7d')}>7 dias</button>
          <button type="button" className={preset === '30d' ? 'adm-chip adm-chip-on' : 'adm-chip'} onClick={() => applyPreset('30d')}>30 dias</button>
          <button type="button" className={preset === 'custom' ? 'adm-chip adm-chip-on' : 'adm-chip'} onClick={() => setPreset('custom')}>Personalizado</button>
        </div>
        <label>
          De
          <input type="date" value={from} onChange={event => { setFrom(event.target.value); setPreset('custom') }} />
        </label>
        <label>
          Até
          <input type="date" value={to} onChange={event => { setTo(event.target.value); setPreset('custom') }} />
        </label>
        <label>
          Campanha
          <select value={campaign} onChange={event => setCampaign(event.target.value)}>
            <option value="todas">Todas as campanhas</option>
            {campaignOptions.map(name => (
              <option key={name} value={name}>{name === 'direto' ? 'Direto (sem UTM)' : name}</option>
            ))}
          </select>
        </label>
      </section>

      {loading && <p className="adm-muted">Carregando dados…</p>}
      {isEmpty && !loading && (
        <div className="adm-empty">Ainda não há dados no período selecionado. Assim que a página receber visitas pelo anúncio, os números aparecem aqui.</div>
      )}

      {agg && (
        <>
          <section className="adm-card" aria-label="Funil">
            <h2>Funil de conversão</h2>
            <div className="adm-funnel">
              {steps.map((step, index) => {
                const prev = index === 0 ? null : steps[index - 1].value
                const pctPrev = prev && prev > 0 ? (step.value / prev) * 100 : null
                const pctTotal = agg.pageview > 0 ? (step.value / agg.pageview) * 100 : 0
                return (
                  <div className="adm-funnel-row" key={step.label}>
                    <div className="adm-funnel-meta">
                      <span className="adm-funnel-label">{step.label}</span>
                      <span className="adm-funnel-value">{intFmt.format(step.value)}</span>
                      <span className="adm-funnel-pcts">
                        {pctPrev !== null && <em>{pctFmt(pctPrev)} da etapa anterior</em>}
                        <em>{pctFmt(pctTotal)} das visitas</em>
                      </span>
                    </div>
                    <div className="adm-funnel-track">
                      <div className="adm-funnel-bar" style={{ width: `${Math.max(2, (step.value / maxStep) * 100)}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="adm-cards" aria-label="Resumo financeiro">
            <div className="adm-stat">
              <span>Receita registrada</span>
              <strong>{brl.format(agg.revenue)}</strong>
            </div>
            <div className="adm-stat">
              <span>Gasto em campanha</span>
              <strong>{brl.format(agg.spend)}</strong>
            </div>
            <div className="adm-stat">
              <span>ROAS</span>
              <strong>{roas === '—' ? '—' : `${roas}x`}</strong>
            </div>
            <div className="adm-stat">
              <span>Receita por clique no checkout</span>
              <strong>{ticket}</strong>
            </div>
          </section>

          <section className="adm-card" aria-label="Mapa de calor de visitas">
            <h2>Visitas por dia da semana e horário</h2>
            {peakValue > 0 && peakIndex >= 0 && (
              <p className="adm-peak">
                Pico de visitas: <strong>{DAY_NAMES_FULL[Math.floor(peakIndex / 24)]}</strong> às <strong>{pad(peakIndex % 24)}h</strong> — {intFmt.format(peakValue)} visitas no período.
              </p>
            )}
            <div className="adm-heat-scroll">
              <div className="adm-heat" role="img" aria-label="Mapa de calor de visitas por dia da semana e hora">
                <div className="adm-heat-corner" />
                {Array.from({ length: 24 }, (_, hour) => (
                  <div className="adm-heat-hour" key={hour}>{pad(hour)}</div>
                ))}
                {DAY_NAMES.map((dayName, day) => (
                  <div className="adm-heat-rowcontents" key={dayName}>
                    <div className="adm-heat-day">{dayName}</div>
                    {Array.from({ length: 24 }, (_, hour) => {
                      const value = agg.hours[day * 24 + hour] || 0
                      const ratio = value / maxHour
                      return (
                        <div
                          key={hour}
                          className="adm-heat-cell"
                          title={`${DAY_NAMES_FULL[day]} às ${pad(hour)}h — ${intFmt.format(value)} visita(s)`}
                          style={{
                            backgroundColor: value === 0 ? '#f3ecdf' : `rgba(241, 90, 36, ${0.12 + 0.88 * ratio})`,
                            color: ratio > 0.55 ? '#fff' : '#8a8172',
                          }}
                        >
                          {value > 0 ? value : ''}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="adm-heat-legend">
              <span>Menos</span>
              <span className="adm-heat-swatch" style={{ backgroundColor: 'rgba(241, 90, 36, 0.2)' }} />
              <span className="adm-heat-swatch" style={{ backgroundColor: 'rgba(241, 90, 36, 0.55)' }} />
              <span className="adm-heat-swatch" style={{ backgroundColor: 'rgba(241, 90, 36, 1)' }} />
              <span>Mais visitas</span>
            </div>
          </section>

          <section className="adm-card" aria-label="Lançamentos manuais">
            <h2>Lançar gasto e receita</h2>
            <p className="adm-muted">Informe quanto a campanha gastou e quanto voltou em vendas no dia. Esses valores alimentam a receita, o gasto e o ROAS acima. Lançar de novo no mesmo dia e campanha substitui os valores.</p>
            <form className="adm-form" onSubmit={handleSaveManual}>
              <label>
                Data
                <input type="date" value={fDate} onChange={event => setFDate(event.target.value)} required />
              </label>
              <label>
                Campanha
                <input type="text" value={fCampaign} onChange={event => setFCampaign(event.target.value)} placeholder="Ex.: meta-ads-louvores" list="adm-campaign-list" />
                <datalist id="adm-campaign-list">
                  {(view?.campaigns ?? []).map(name => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </label>
              <label>
                Gasto (R$)
                <input type="number" min="0" step="0.01" value={fSpend} onChange={event => setFSpend(event.target.value)} placeholder="0,00" required />
              </label>
              <label>
                Receita (R$)
                <input type="number" min="0" step="0.01" value={fRevenue} onChange={event => setFRevenue(event.target.value)} placeholder="0,00" required />
              </label>
              <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>{saving ? 'Salvando…' : 'Salvar lançamento'}</button>
            </form>
            {notice && <p className="adm-notice">{notice}</p>}
            {agg.entries.length > 0 ? (
              <table className="adm-table">
                <thead>
                  <tr><th>Data</th><th>Campanha</th><th>Gasto</th><th>Receita</th></tr>
                </thead>
                <tbody>
                  {agg.entries.map(entry => (
                    <tr key={`${entry.date}-${entry.campaign}`}>
                      <td>{displayDate(entry.date)}</td>
                      <td>{entry.campaign === 'direto' ? 'Direto (sem UTM)' : entry.campaign}</td>
                      <td>{brl.format(entry.spend)}</td>
                      <td>{brl.format(entry.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="adm-muted">Nenhum lançamento manual no período.</p>
            )}
          </section>
        </>
      )}
    </div>
  )
}
