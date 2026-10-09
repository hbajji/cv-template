import { initializeApp } from 'firebase/app'
import { initializeAnalytics, isSupported, logEvent, setAnalyticsCollectionEnabled, type Analytics } from 'firebase/analytics'

// ✏️ Optional: paste your Firebase web config here to get audience statistics
// (Firebase console > Project settings > Your apps > Web app > SDK setup and configuration).
// These values are public identifiers, not secrets. Left empty, analytics is disabled
// and the cookie banner and "Manage cookies" link are not shown.
const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: '',
}

export const analyticsConfigured = !!(firebaseConfig.apiKey && firebaseConfig.measurementId)

export type Consent = 'granted' | 'denied'
const CONSENT_KEY = 'cv-analytics-consent'

// CNIL: the visitor's choice is asked again after 6 months, and the Google cookie
// lives at most 13 months (GA's own default is 2 years).
const CONSENT_MAX_AGE_MS = 182 * 24 * 3600 * 1000
const COOKIE_MAX_AGE_S = 390 * 24 * 3600

export function getConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    const { value, at } = JSON.parse(raw) as { value?: unknown; at?: unknown }
    if (value !== 'granted' && value !== 'denied') return null
    if (typeof at !== 'number' || Date.now() - at > CONSENT_MAX_AGE_MS) return null
    return value
  } catch {
    // storage unavailable, or a choice saved in the old plain-string format: ask again
    return null
  }
}

// Analytics (and its cookies) only start once the visitor has accepted,
// and only in the production build so local development does not pollute the stats.
let analytics: Promise<Analytics | null> | null = null

function start() {
  if (analytics || !import.meta.env.PROD || !analyticsConfigured) return
  analytics = isSupported()
    .then((ok) => (ok ? initializeAnalytics(initializeApp(firebaseConfig), { config: { cookie_expires: COOKIE_MAX_AGE_S } }) : null))
    .catch(() => null)
}

// Withdrawing must be as easy as accepting: stop collection, drop the Google cookies,
// and reload so the already-loaded tag is gone.
async function stop() {
  const a = await analytics
  if (a) setAnalyticsCollectionEnabled(a, false)
  const host = window.location.hostname
  for (const name of document.cookie.split(';').map((c) => c.split('=')[0].trim())) {
    if (!name.startsWith('_ga')) continue
    for (const domain of ['', `; domain=${host}`, `; domain=.${host}`]) {
      document.cookie = `${name}=; max-age=0; path=/${domain}`
    }
  }
  window.location.reload()
}

export function setConsent(consent: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ value: consent, at: Date.now() }))
  } catch {
    // storage unavailable: the choice only lasts for this visit
  }
  if (consent === 'granted') start()
  else if (analytics) void stop()
}

if (getConsent() === 'granted') start()

type EventName = 'download_pdf' | 'select_section' | 'project_link_click' | 'notice_click'

export function track(event: EventName, params: Record<string, string>) {
  if (!import.meta.env.PROD) console.debug('[analytics]', event, params)
  void analytics?.then((a) => a && logEvent(a, event, params))
}
