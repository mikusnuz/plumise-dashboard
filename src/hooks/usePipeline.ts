import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

export const usePipelineTopology = (model?: string) => {
  return useQuery({
    queryKey: ['pipelineTopology', model],
    queryFn: () => api.getPipelineTopology(model),
    refetchInterval: 10000,
  })
}
