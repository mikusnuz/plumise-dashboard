import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nProvider } from './i18n'
import { ThemeProvider } from './theme'
import Layout from './components/Layout'
import Overview from './pages/Overview'
import Agents from './pages/Agents'
import Rewards from './pages/Rewards'
import Challenges from './pages/Challenges'
import MyNode from './pages/MyNode'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5000,
    },
  },
})

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Overview />} />
                <Route path="agents" element={<Agents />} />
                <Route path="rewards" element={<Rewards />} />
                <Route path="challenges" element={<Challenges />} />
                <Route path="my-node" element={<MyNode />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}

export default App
