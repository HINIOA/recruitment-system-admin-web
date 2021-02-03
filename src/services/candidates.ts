import request from '@/utils/request';

export async function queryStatus() {
  return request('/api/status');
}

export async function queryCandidates(params) {
  return request(`/api/candidates?status=${params.status}`);
}
