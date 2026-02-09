import { createPublicClient, http, webSocket } from 'viem'
import { plumise, CONTRACTS } from '../config/chain'
import agentRegistryAbi from './agent-registry-abi.json'
import rewardPoolAbi from './reward-pool-abi.json'
import challengeManagerAbi from './challenge-manager-abi.json'

export const publicClient = createPublicClient({
  chain: plumise,
  transport: http(),
})

export const wsClient = createPublicClient({
  chain: plumise,
  transport: webSocket(),
})

export const contracts = {
  agentRegistry: {
    address: CONTRACTS.AGENT_REGISTRY,
    abi: agentRegistryAbi,
  },
  rewardPool: {
    address: CONTRACTS.REWARD_POOL,
    abi: rewardPoolAbi,
  },
  challengeManager: {
    address: CONTRACTS.CHALLENGE_MANAGER,
    abi: challengeManagerAbi,
  },
}
