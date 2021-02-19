import request from '@/utils/request';

export async function queryInterviewers(params: any) {
  const keyValues: string[] = [];

  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (value) keyValues.push(`${key}=${value}`);
  });

  return request(`/api/interviewer?${keyValues.join('&')}`);
}

export async function queryDeleteInterviewer(id: string) {
  return request.delete(`/api/interviewer/${id}`);
}

export async function queryAddInterviewer(data: { name: string; department: string }) {
  return request.post('/api/interviewer', {
    data,
  });
}

export async function queryUpdateInterviewer(data: { name: string; department: string }) {
  return request.put('/api/interviewer', {
    data,
  });
}
