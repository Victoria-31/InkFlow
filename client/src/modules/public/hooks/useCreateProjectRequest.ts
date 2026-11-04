import { useMutation } from '@tanstack/react-query';
import type { ProjectRequest } from '@inkflow/shared';
import { createProjectRequest } from '@/request/artists';

export function useCreateProjectRequest(username: string) {
  return useMutation({ mutationFn: (request: ProjectRequest) => createProjectRequest(username, request) });
}
