import { Request, Response } from 'express';

const dbData = {
  steps: [
    'firstFiltration',
    'departmentFiltration',
    'interview',
    'offerCommunication',
    'toBeHired',
    'finished',
  ],
  candidates: [
    {
      id: '1',
      name: '张三',
      job: '前端开发工程师',
      education: '华南农业大学（本科）',
      sex: '女',
      age: 32,
      phone: '12345678910',
      email: '123456@qq.com',
      time: new Date(),
      status: 'processing',
      step: 'firstFiltration',
      nextStep: 'departmentFiltration',
      resumeUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      id: '2',
      name: '李四',
      job: '后端开发工程师',
      education: '华南农业大学（硕士）',
      sex: '男',
      age: 42,
      phone: '12345678910',
      email: '123456@qq.com',
      time: new Date(),
      status: 'processing',
      step: 'departmentFiltration',
      nextStep: 'interview',
      resumeUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      id: '3',
      name: '王五',
      job: '后端开发工程师',
      education: '华南农业大学（硕士）',
      sex: '男',
      age: 42,
      phone: '12345678910',
      email: '123456@qq.com',
      time: new Date(),
      status: 'obsolete',
      step: 'interview',
      nextStep: 'offerCommunication',
      resumeUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      id: '4',
      name: '赵六',
      job: '算法工程师',
      education: '华南农业大学（硕士）',
      sex: '男',
      age: 42,
      phone: '12345678910',
      email: '123456@qq.com',
      time: new Date(),
      status: 'processing',
      step: 'offerCommunication',
      nextStep: 'toBeHired',
      resumeUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      id: '5',
      name: '马七',
      job: '测试工程师',
      education: '华南农业大学（硕士）',
      sex: '男',
      age: 42,
      phone: '12345678910',
      email: '123456@qq.com',
      time: new Date(),
      status: 'pass',
      step: 'toBeHired',
      nextStep: null,
      resumeUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      id: '6',
      name: '肖八',
      job: '后端开发工程师',
      education: '华南农业大学（硕士）',
      sex: '男',
      age: 42,
      phone: '12345678910',
      email: '123456@qq.com',
      time: new Date(),
      status: 'pressing',
      step: 'interview',
      nextStep: 'offerCommunication',
      resumeUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  ],
};

const getStatus = () => {
  const statusCounts = {
    all: dbData.candidates.length,
    firstFiltration: 0,
    departmentFiltration: 0,
    interview: 0,
    offerCommunication: 0,
    toBeHired: 0,
    obsolete: 0,
  };

  dbData.candidates.forEach((item) => {
    if (item.status === 'obsolete') statusCounts.obsolete++;
    else statusCounts[item.step]++;
  });

  return [
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
    {
      key: 'obsolete',
      name: '已淘汰',
      count: statusCounts.obsolete,
    },
  ];
};

export default {
  // 'GET /api/status': async (_, res: Response) => res.send(getStatus()),
  // 'GET /api/candidates': async (req: Request, res: Response) => {
  //   const { tab, search } = req.query;
  //   let tableData = search
  //     ? dbData.candidates.filter((item) => item.name.includes(search as string))
  //     : [...dbData.candidates];
  //   if (tab && tab !== 'all') {
  //     tableData = tableData.filter((item) => {
  //       return tab === 'obsolete' ? item.status === 'obsolete' : item.step === tab;
  //     });
  //   }
  //   res.send({
  //     success: true,
  //     status: getStatus(),
  //     tableData,
  //     total: tableData.length,
  //   });
  // },
  // 'GET /api/candidate': async (req: Request, res: Response) => {
  //   const { id } = req.query;
  //   const data = dbData.candidates.find((item) => item.id === id);
  //   res.send(
  //     data
  //       ? {
  //           data,
  //           isSuccess: true,
  //         }
  //       : {
  //           data: {},
  //           isSuccess: false,
  //         },
  //   );
  // },
  // 'POST /api/candidate/update': async (req: Request, res: Response) => {
  //   const { candidates } = req.body;
  //   const candidateMap = {};
  //   const dbCandidates = dbData.candidates;
  //   const newCandidates = [];
  //   candidates.forEach((item) => {
  //     candidateMap[item.id] = item;
  //   });
  //   dbCandidates.forEach((item) => {
  //     const newCandidate = candidateMap[item.id];
  //     if (newCandidate) newCandidates.push(newCandidate);
  //     else newCandidates.push(item);
  //   });
  //   dbData.candidates = [...newCandidates];
  //   res.send({
  //     success: true,
  //     data: candidates,
  //   });
  // },
  // 'POST /api/candidate/pass': async (req: Request, res: Response) => {
  //   const { ids } = req.body;
  //   const data = [];
  //   dbData.candidates = dbData.candidates.map((item) => {
  //     const candidate = { ...item };
  //     if (ids.includes(item.id)) {
  //       const stepIdx = dbData.steps.indexOf(candidate.step);
  //       candidate.step = dbData.steps[stepIdx + 1];
  //       data.push(candidate);
  //     }
  //     return candidate;
  //   });
  //   res.send({
  //     success: true,
  //     data,
  //   });
  // },
  // 'POST /api/candidate/obsolete': async (req: Request, res: Response) => {
  //   const { ids } = req.body;
  //   const data = [];
  //   dbData.candidates = dbData.candidates.map((item) => {
  //     const candidate = { ...item };
  //     if (ids.includes(item.id)) {
  //       candidate.status = 'obsolete';
  //       data.push({ ...candidate });
  //     }
  //     return candidate;
  //   });
  //   res.send({
  //     success: true,
  //     data,
  //   });
  // },
};
