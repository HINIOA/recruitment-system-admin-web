import request from '@/utils/request';

export async function queryStatus() {
  return request('/api/status');
}

export async function queryCandidates(params) {
  return request(`/api/candidates?tab=${params.tab}`);
}

export async function queryCandidate(id: string) {
  return request(`/api/candidate?id=${id}`);
}

export async function updateCandidate(candidate) {
  return request(`/api/candidate/update?id=${candidate.id}`, {
    method: 'POST',
    data: {
      candidate,
    },
  });
}
