import type {
  NetworkStats,
  Agent,
  AgentDetail,
  Epoch,
  EpochDetail,
  Challenge,
  Rewards,
  RewardFormula,
} from './types'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:15481/api'

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const api = {
  getStats: () => fetchApi<NetworkStats>('/stats'),
  getAgents: () => fetchApi<Agent[]>('/agents'),
  getActiveAgents: () => fetchApi<Agent[]>('/agents/active'),
  getAgent: (address: string) => fetchApi<AgentDetail>(`/agents/${address}`),
  getEpochs: () => fetchApi<Epoch[]>('/epochs'),
  getEpoch: (num: number) => fetchApi<EpochDetail>(`/epochs/${num}`),
  getChallenges: () => fetchApi<Challenge[]>('/challenges'),
  getCurrentChallenge: () => fetchApi<Challenge | null>('/challenges/current'),
  getRewards: (address: string) => fetchApi<Rewards>(`/rewards/${address}`),
  getFormula: () => fetchApi<RewardFormula>('/formula'),
}
