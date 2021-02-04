import request from '@/utils/request';

export async function queryStatus() {
  return request('/api/status');
}

export async function queryCandidates(params) {
  return request(`/api/candidates?tab=${params.tab}&search=${params.search}`);
}

export async function queryCandidate(id: string) {
  return request(`/api/candidate?id=${id}`);
}

export async function passCandidates(ids: string[]) {
  return request('/api/candidate/pass', {
    method: 'POST',
    data: {
      ids,
    },
  });
}

export async function obsoleteCandidates(ids: string[]) {
  return request('/api/candidate/obsolete', {
    method: 'POST',
    data: {
      ids,
    },
  });
}
