import { Request, Response } from 'express';

const dbData = [
  {
    id: '1',
    name: '李春花',
    job: '前端开发工程师',
    education: '华南农业大学（本科）',
    sex: '女',
    age: 32,
    phone: '12345678910',
    email: '123456@qq.com',
    time: new Date(),
    status: 'processing',
    step: 'firstFiltration',
    resumeUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    id: '2',
    name: '张三',
    job: '后端开发工程师',
    education: '华南农业大学（硕士）',
    sex: '男',
    age: 42,
    phone: '12345678910',
    email: '123456@qq.com',
    time: new Date(),
    status: 'processing',
    step: 'departmentFiltration',
    resumeUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    id: '3',
    name: '张三',
    job: '后端开发工程师',
    education: '华南农业大学（硕士）',
    sex: '男',
    age: 42,
    phone: '12345678910',
    email: '123456@qq.com',
    time: new Date(),
    status: 'obsolete',
    step: 'interview',
    resumeUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    id: '4',
    name: '张三',
    job: '后端开发工程师',
    education: '华南农业大学（硕士）',
    sex: '男',
    age: 42,
    phone: '12345678910',
    email: '123456@qq.com',
    time: new Date(),
    status: 'processing',
    step: 'offerCommunication',
    resumeUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    id: '5',
    name: '张三',
    job: '后端开发工程师',
    education: '华南农业大学（硕士）',
    sex: '男',
    age: 42,
    phone: '12345678910',
    email: '123456@qq.com',
    time: new Date(),
    status: 'pass',
    step: 'toBeHired',
    resumeUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
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
  'GET /api/candidate': async (req: Request, res: Response) => {
    const { id } = req.query;
    const data = dbData.find((item) => item.id === id);

    res.send(
      data
        ? {
            data,
            isSuccess: true,
          }
        : {
            data: {},
            isSuccess: false,
          },
    );
  },
  'POST /api/candidate/update': async (req: Request, res: Response) => {
    const { id } = req.query;
    const { candidate: data } = req.body;
    const candidate = dbData.find((item) => item.id === id);

    Object.keys(data).forEach((key) => {
      candidate[key] = data[key];
    });

    res.send({
      data: candidate,
    });
  },
};
