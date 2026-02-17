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

export interface EpochContribution extends Contribution {
  wallet: string
}

export interface EpochDetail {
  number: number
  reward: string
  agentCount: number
  distributed: boolean
  contributions: EpochContribution[]
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

export interface LeaderboardAgent {
  rank: number
  wallet: string
  totalRewardShare: string
  epochCount: number
  totalTaskCount: number
  totalTokensProcessed: string
  totalUptimeSeconds: number
}

export interface LeaderboardData {
  updatedAt: string
  totalDistributed: string
  agents: LeaderboardAgent[]
}

export interface RewardHistoryEpoch {
  epoch: number
  estimatedReward: string
  totalEpochReward: string
  agentCount: number
  contribution: {
    taskCount: number
    uptimeSeconds: number
    responseScore: number
    processedTokens: string
  }
}

export interface RewardHistory {
  wallet: string
  totalEstimated: string
  epochs: RewardHistoryEpoch[]
}

export interface TokenomicsData {
  currentBlock: number
  currentEpoch: number
  blocksPerEpoch: number
  blockRewardPLM: string
  halvingInterval: number
  halvingCount: number
  nextHalvingBlock: number
  blocksUntilHalving: number
  nextHalvingEstDate: string
  genesisSupply: string
  allocations: {
    rewardPool: string
    foundation: string
    ecosystem: string
    team: string
    liquidity: string
  }
}
