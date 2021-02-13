import { formatCandidate } from '@/utils/dataFormatter';
import request from '@/utils/request';

export async function queryStatus() {
  return request('/api/tabs');
}

export async function queryCandidates(params) {
  let url = '/api/candidate?';
  const keyValue: string[] = [];

  Object.keys(params).forEach((key) => params[key] && keyValue.push(`${key}=${params[key]}`));
  url += keyValue.join('&');

  const res = await request(url);
  res.tableData = res.tableData.map((data) => formatCandidate(data));

  return formatCandidate(res);
}

export async function queryCandidate(id: string) {
  const res = await request(`/api/candidate/${id}`);
  res.data = formatCandidate(res.data);

  return res;
}

export async function passCandidates(ids: string[]) {
  const res = await request('/api/candidate/operation', {
    method: 'POST',
    data: {
      ids,
      operation: 'pass',
    },
  });
  return res.data;
}

export async function obsoleteCandidates(ids: string[]) {
  const res = await request('/api/candidate/operation', {
    method: 'POST',
    data: {
      ids,
      operation: 'obsolete',
    },
  });
  return res.data;
}
