import { Request, Response } from 'express';

const dbData = {
  jobs: [
    {
      id: '1',
      name: '前端开发工程师',
      department: 'A部门',
      desc: '这是前端开发工程师岗位的描述',
      c_time: new Date(),
      location: '广东·深圳市',
      types: ['研发类', '全职'],
      number: 10,
    },
    {
      id: '2',
      name: '后端开发工程师',
      department: 'B部门',
      desc: '这是后端开发工程师岗位的描述',
      c_time: new Date(),
      location: '广东·深圳市',
      types: ['研发类', '全职'],
      number: 10,
    },
    {
      id: '3',
      name: '测试工程师',
      department: 'C部门',
      desc: '这是测试工程师岗位的描述',
      c_time: new Date(),
      location: '广东·深圳市',
      types: ['研发类', '全职'],
      number: 10,
    },
    {
      id: '4',
      name: '算法工程师',
      department: 'D部门',
      desc: '这是算法工程师岗位的描述',
      c_time: new Date(),
      location: '广东·深圳市',
      types: ['研发类', '全职'],
      number: 10,
    },
  ],
};

export default {
  'GET /api/jobs': async (req: Request, res: Response) => {
    const { page, name, department, types } = req.query;
    const filtratedJobs = dbData.jobs.filter((job) => {
      if (name && job.name !== name) return false;
      if (department && job.department !== department) return false;
      if (types) {
        const typeArr = (types as string).split(',');

        for (let i = 0; i < typeArr.length; i++) {
          if (!job.types.includes(typeArr[i])) return false;
        }
      }

      return true;
    });

    res.send({
      data: filtratedJobs,
    });
  },
  'POST /api/job': async (req: Request, res: Response) => {
    const { id } = req.query;
    const { job } = req.body;

    if (id) {
      const index = dbData.jobs.findIndex((job) => job.id === id);
      dbData.jobs[index] = job;
      // console.log(job, dbData.jobs);
    } else {
      dbData.jobs.push({
        id: Date.now().toString(),
        ...job,
      });
    }

    res.send({
      success: true,
    });
  },
  'DELETE /api/job': async (req: Request, res: Response) => {
    const { id } = req.body;
    const index = dbData.jobs.findIndex((job) => job.id === id);

    dbData.jobs.splice(index, 1);

    res.send({
      success: true,
    });
  },
};
