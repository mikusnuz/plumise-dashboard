# Plumise AI Dashboard

Real-time dashboard for the Plumise AI chain network.

## Features

- **Network Overview**: Real-time stats, reward charts, current challenges
- **Agent Management**: View all registered agents, active status, heartbeat monitoring
- **Reward Tracking**: Epoch-by-epoch distribution history, reward formula breakdown
- **Challenge History**: Proof-of-work challenge tracking, difficulty trends
- **My Node**: Connect wallet, view personal agent stats, claim rewards

## Tech Stack

- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS v4
- viem (Ethereum interactions)
- @tanstack/react-query (data fetching)
- motion/react (animations)
- recharts (charts)
- lucide-react (icons)
- react-router-dom v7

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
VITE_RPC_URL=https://node-1.plm.plumbug.studio/rpc
VITE_WS_URL=wss://node-1.plm.plumbug.studio/ws
VITE_CHAIN_ID=41956
VITE_REWARD_POOL_ADDRESS=0x0000000000000000000000000000000000001000
VITE_AGENT_REGISTRY_ADDRESS=0xC9CF64344D22f02f6cDB8e7B5349f30E09F9043C
VITE_CHALLENGE_MANAGER_ADDRESS=0x0000000000000000000000000000000000000000
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Docker

Build and run with Docker:

```bash
docker build -t plumise-dashboard .
docker run -p 80:80 plumise-dashboard
```

Or use docker-compose:

```bash
docker-compose up -d
```

## Project Structure

```
plumise-dashboard/
├── src/
│   ├── App.tsx                      # Main app with routing
│   ├── main.tsx                     # Entry point
│   ├── index.css                    # Tailwind v4 + dark theme
│   ├── config/
│   │   └── chain.ts                 # Chain config (chainId: 41956, RPC)
│   ├── hooks/
│   │   ├── useAgents.ts             # Fetch active agents
│   │   ├── useRewards.ts            # Fetch reward/epoch data
│   │   ├── useChallenges.ts         # Fetch challenge data
│   │   └── useNetworkStats.ts       # Network overview stats
│   ├── components/
│   │   ├── Layout.tsx               # Main layout with sidebar
│   │   ├── Sidebar.tsx              # Navigation sidebar
│   │   ├── StatCard.tsx             # Stats display card
│   │   ├── AgentTable.tsx           # Agent list table
│   │   ├── RewardChart.tsx          # Reward distribution chart
│   │   └── ChallengeCard.tsx        # Current challenge display
│   ├── pages/
│   │   ├── Overview.tsx             # Network overview
│   │   ├── Agents.tsx               # Agent list & details
│   │   ├── Rewards.tsx              # Reward distribution history
│   │   ├── Challenges.tsx           # Challenge history
│   │   └── MyNode.tsx               # Personal node dashboard
│   └── lib/
│       ├── contracts.ts             # Contract instances (viem)
│       ├── formatters.ts            # Number/address formatters
│       ├── agent-registry-abi.json
│       ├── reward-pool-abi.json
│       └── challenge-manager-abi.json
├── public/
├── .env.example
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Chain Info

- **Chain ID**: 41956 (0xA3E4)
- **Network**: Plumise AI
- **RPC**: https://node-1.plm.plumbug.studio/rpc
- **Explorer**: https://scan.plumise.com

## Contracts

- **RewardPool**: `0x0000000000000000000000000000000000001000`
- **AgentRegistry**: `0xC9CF64344D22f02f6cDB8e7B5349f30E09F9043C`
- **ChallengeManager**: `0x0000000000000000000000000000000000000000` (placeholder)

## Reward Formula

Rewards are calculated based on weighted contributions:

- **Task Completion**: 50%
- **Uptime**: 30%
- **Response Quality**: 20%

## License

MIT
