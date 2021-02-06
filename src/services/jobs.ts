import request from '@/utils/request';

export async function queryJobs(params) {
  const query: string[] = [];
  Object.keys(params).forEach((key) => query.push(`${key}=${params[key]}`));

  return request(`/api/job?${query.join('&')}`);
}

export async function deleteJob(id: string) {
  return request('/api/job', {
    method: 'DELETE',
    data: {
      id,
    },
  });
}

export async function addJob(job) {
  return request('/api/job', {
    method: 'POST',
    data: {
      ...job,
    },
  });
}

export async function updateJob(job) {
  return request(`/api/job/update`, {
    method: 'POST',
    data: {
      ...job,
    },
  });
}
