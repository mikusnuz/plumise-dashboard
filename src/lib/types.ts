export interface NetworkStats {
  blockNumber: number
  activeAgents: number
  totalAgents: number
  currentEpoch: number
}

export interface Agent {
  wallet: string
  nodeId: string
  metadata: string
  registeredAt: string
  lastHeartbeat: string
  status: number
  stake: string
}

export interface Contribution {
  taskCount: number
  uptimeSeconds: number
  responseScore: number
  lastUpdated: string
}

export interface AgentDetail {
  agent: Agent
  contribution: Contribution
}

export interface Rewards {
  pending: string
  contribution: Contribution
}

export interface RewardFormula {
  task: number
  uptime: number
  response: number
}

export interface Epoch {
  number: number
  reward: string
  agentCount: number
  distributed: boolean
}

export interface EpochDetail {
  number: number
  reward: string
  agentCount: number
  distributed: boolean
  contributions: Contribution[]
}

export interface Challenge {
  id: number
  difficulty: number
  seed: string
  createdAt: string
  expiresAt: string
  solved: boolean
  solver: string
  rewardBonus: string
}
