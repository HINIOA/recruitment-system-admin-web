import request from '@/utils/request';

export async function queryJobs(params) {
  const query: string[] = [];
  Object.keys(params).forEach((key) => query.push(`${key}=${params[key]}`));

  return request(`/api/jobs?${query.join('&')}`);
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
      job,
    },
  });
}

export async function updateJob(job) {
  const { id } = job;

  return request(`/api/job?id=${id}`, {
    method: 'POST',
    data: {
      job,
    },
  });
}
