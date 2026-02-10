import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Award, Zap, User } from 'lucide-react'

const navigation = [
  { name: 'Overview', to: '/', icon: LayoutDashboard },
  { name: 'Agents', to: '/agents', icon: Users },
  { name: 'Rewards', to: '/rewards', icon: Award },
  { name: 'Challenges', to: '/challenges', icon: Zap },
  { name: 'My Node', to: '/my-node', icon: User },
]

export const Sidebar = () => {
  return (
    <aside className="w-64 glass-card m-4 p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Plumise AI
        </h1>
        <p className="text-sm text-slate-400 mt-1">Network Dashboard</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400'
                  : 'text-slate-300 hover:bg-slate-700/30 hover:text-cyan-400'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
        <p className="text-xs text-slate-400 mb-2">Chain ID</p>
        <p className="text-sm font-mono text-cyan-400">
          {import.meta.env.VITE_CHAIN_ID || '41956'} (0x{Number(import.meta.env.VITE_CHAIN_ID || 41956).toString(16).toUpperCase()})
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
