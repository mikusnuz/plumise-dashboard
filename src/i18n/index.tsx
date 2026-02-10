import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import en from './en'
import ko from './ko'

type Locale = 'en' | 'ko'
type Translations = typeof en

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const translations: Record<Locale, Translations> = { en, ko }

const I18nContext = createContext<I18nContextType | null>(null)

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('plumise-lang') as Locale
    return saved && translations[saved] ? saved : 'en'
  })

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('plumise-lang', newLocale)
  }, [])

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    let text = (translations[locale] as Record<string, string>)[key] || (translations['en'] as Record<string, string>)[key] || key
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v))
      })
    }
    return text
  }, [locale])

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useTranslation = () => {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider')
  return ctx
}

export type { Locale }
