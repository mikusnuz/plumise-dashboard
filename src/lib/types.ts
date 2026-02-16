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

export interface PipelineNode {
  address: string
  grpcEndpoint: string
  httpEndpoint: string
  layerStart: number
  layerEnd: number
  pipelineOrder: number
  ready: boolean
}

export interface PipelineTopology {
  model: string
  totalLayers: number
  nodes: PipelineNode[]
}

export interface ThroughputData {
  epoch: number
  totalTokens: string
  agentCount: number
  totalRequests: number
  avgLatency: string
  maxUptime: number
  throughputTokPerSec: string
}

export interface AgentCapacity {
  address: string
  epoch: number
  tokensProcessed: string
  requestCount: number
  uptimeSeconds: number
  avgLatencyMs: string
  throughputTokPerSec: string
  benchmarkTokPerSec: number
  device: string
  ramMb: number
  vramMb: number
}
