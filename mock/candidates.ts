import { Request, Response } from 'express';

const dbData = [
  {
    key: '1',
    name: '李春花',
    job: '前端开发工程师',
    education: '华南农业大学（本科）',
    sex: '女',
    age: 32,
    time: new Date(),
    status: 'firstFiltration',
  },
  {
    key: '2',
    name: '张三',
    job: '后端开发工程师',
    education: '华南农业大学（硕士）',
    sex: '男',
    age: 42,
    time: new Date(),
    status: 'departmentFiltration',
  },
  {
    key: '3',
    name: '张三',
    job: '后端开发工程师',
    education: '华南农业大学（硕士）',
    sex: '男',
    age: 42,
    time: new Date(),
    status: 'interview',
  },
  {
    key: '4',
    name: '张三',
    job: '后端开发工程师',
    education: '华南农业大学（硕士）',
    sex: '男',
    age: 42,
    time: new Date(),
    status: 'offerCommunication',
  },
  {
    key: '5',
    name: '张三',
    job: '后端开发工程师',
    education: '华南农业大学（硕士）',
    sex: '男',
    age: 42,
    time: new Date(),
    status: 'toBeHired',
  },
];

export default {
  'GET /api/status': async (_, res: Response) => {
    const statusCounts = {
      all: dbData.length,
      firstFiltration: 0,
      departmentFiltration: 0,
      interview: 0,
      offerCommunication: 0,
      toBeHired: 0,
    };

    dbData.forEach((item) => {
      statusCounts[item.status]++;
    });

    res.send([
      {
        key: 'all',
        name: '所有',
        count: statusCounts.all,
      },
      {
        key: 'firstFiltration',
        name: '初筛',
        count: statusCounts.firstFiltration,
      },
      {
        key: 'departmentFiltration',
        name: '用人部门筛选',
        count: statusCounts.departmentFiltration,
      },
      {
        key: 'interview',
        name: '面试',
        count: statusCounts.interview,
      },
      {
        key: 'offerCommunication',
        name: 'offer沟通',
        count: statusCounts.offerCommunication,
      },
      {
        key: 'toBeHired',
        name: '待入职',
        count: statusCounts.toBeHired,
      },
    ]);
  },
  'GET /api/candidates': async (req: Request, res: Response) => {
    const { status } = req.query;
    const data =
      !status || status === 'all' ? dbData : dbData.filter((item) => item.status === status);

    res.send({
      data,
      success: true,
      total: data.length,
    });
  },
};
