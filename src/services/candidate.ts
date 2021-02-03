export default function getCandidates(params) {
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
  const data = params.tab === 'all' ? dbData : dbData.filter((item) => item.status === params.tab);
  const response = {
    data,
    success: true,
    total: data.length,
  };

  console.log('getCandidates');

  return new Promise((resolve) => {
    resolve(response);
  });
}
