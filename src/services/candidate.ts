import request from '@/utils/request';

export async function queryStatus() {
  return request('/api/tabs');
}

export async function queryCandidates(params) {
  let url = '/api/candidate?';
  const keyValue: string[] = [];

  Object.keys(params).forEach((key) => params[key] && keyValue.push(`${key}=${params[key]}`));
  url += keyValue.join('&');
  console.log(url);
  return request(url);
}

export async function queryCandidate(id: string) {
  return request(`/api/candidate/${id}`);
}

export async function passCandidates(ids: string[]) {
  return request('/api/candidate/operation', {
    method: 'POST',
    data: {
      ids,
      operation: 'pass',
    },
  });
}

export async function obsoleteCandidates(ids: string[]) {
  return request('/api/candidate/operation', {
    method: 'POST',
    data: {
      ids,
      operation: 'obsolete',
    },
  });
}
