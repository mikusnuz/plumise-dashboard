import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Award, Zap, User, Sun, Moon, Globe } from 'lucide-react'
import { useTranslation } from '../i18n'
import { useTheme } from '../theme'

export const Sidebar = () => {
  const { t, locale, setLocale } = useTranslation()
  const { theme, toggleTheme } = useTheme()

  const navigation = [
    { key: 'nav.overview', to: '/', icon: LayoutDashboard },
    { key: 'nav.agents', to: '/agents', icon: Users },
    { key: 'nav.rewards', to: '/rewards', icon: Award },
    { key: 'nav.challenges', to: '/challenges', icon: Zap },
    { key: 'nav.myNode', to: '/my-node', icon: User },
  ]

  return (
    <aside className="w-64 glass-card m-4 p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Plumise AI
        </h1>
        <p className="text-sm text-label mt-1">{t('sidebar.dashboard')}</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.key}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive ? 'tab-active' : 'tab-inactive'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{t(item.key)}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-elevated text-body transition-colors hover:text-cyan-400"
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span className="text-sm">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
          <button
            onClick={() => setLocale(locale === 'en' ? 'ko' : 'en')}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-elevated text-body transition-colors hover:text-cyan-400"
            title={locale === 'en' ? '한국어' : 'English'}
          >
            <Globe size={16} />
            <span className="text-sm">{locale === 'en' ? '한국어' : 'EN'}</span>
          </button>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
          <p className="text-xs text-label mb-2">{t('sidebar.chainId')}</p>
          <p className="text-sm font-mono text-cyan-400">
            {import.meta.env.VITE_CHAIN_ID || '41956'} (0x{Number(import.meta.env.VITE_CHAIN_ID || 41956).toString(16).toUpperCase()})
          </p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
