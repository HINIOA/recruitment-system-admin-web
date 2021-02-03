import React, { useState } from 'react';
import Table from '@ant-design/pro-table';
import { Input, Space, Button, Badge, Tag, Modal } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useHistory } from 'umi';
import type { History } from 'umi';
import getCandidates from '../../services/candidate';

const { Search } = Input
const { confirm } = Modal

const renderSearch = (handleSearch) => (
  <div style={{paddingRight: '1rem'}} >
    <Search placeholder="搜索候选人"  onSearch={handleSearch} size="large" enterButton />
  </div>
)

const renderBadge = (count: number, active = false) => {
  return (
    <Badge
      count={count}
      style={{
        marginTop: -2,
        marginLeft: 4,
        color: active ? '#1890FF' : '#999',
        backgroundColor: active ? '#E6F7FF' : '#eee',
      }}
    />
  );
};

const handelClickPass = (candidate, tableActions) => {
  confirm({
    title: `确认${candidate.name}通过吗？`,
    icon: <ExclamationCircleOutlined />,
    okText: '是',
    cancelText: '否',
    onOk() {
      // TODO：发送请求
      console.log('pass', candidate);
      tableActions.reload()
    },
  });
}

const handelClickObsolete = (candidate, tableActions) => {
  confirm({
    title: `确定淘汰${candidate.name}吗？`,
    icon: <ExclamationCircleOutlined />,
    okText: '是',
    okType: 'danger',
    cancelText: '否',
    onOk() {
      // TODO：发送请求
      console.log('obsolete', candidate);
      tableActions.reload()
    },
  });
}

const getColumns = (router: History , includeStatusCol: boolean) => {
  const columns: any[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '投递岗位',
      dataIndex: 'job',
      key: 'job',
    },
    {
      title: '学历',
      dataIndex: 'education',
      key: 'education',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '投递时间',
      dataIndex: 'time',
      key: 'time',
      valueType: 'date',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, rowData, __, action) => {
        const optionDoms = [<Button key="view" icon={<EyeOutlined />} onClick={() => router.push(`/candidate/${rowData.id}`)}>查看</Button>]

        if (rowData.status === 'firstFiltration' || rowData.status === 'offerCommunication') 
          optionDoms.push(
            <Button key="pass" type="primary" icon={<CheckOutlined />} onClick={() => handelClickPass(rowData, action)}>通过</Button>,
            <Button key="obsolete" type="primary" icon={<CloseOutlined />} onClick={() => handelClickObsolete(rowData, action)} danger>淘汰</Button>
          )
        
        return optionDoms
      },
    },
  ];

  if (!includeStatusCol) return columns

  const statusColumn = {
    title: '状态',
    key: 'status',
    render: (_, rowData) => {
      const map = {
        firstFiltration: {
          name: '初筛',
          color: 'orange',
        },
        departmentFiltration: {
          name: '用人部门筛选',
          color: 'gold',
        },
        interview: {
          name: '面试',
          color: 'purple',
        },
        offerCommunication: {
          name: 'offer沟通',
          color: 'blue',
        },
        toBeHired: {
          name: '待入职',
          color: 'green',
        },
      }
      const { name, color } = map[rowData.status]

      return (
        <Space>
          <Tag color={color} key={name}>
            {name}
          </Tag>
        </Space>
      )
    }
  }

  columns.splice(3, 0, statusColumn)
  return columns
}

const Workplace: React.FC = () => {
  const history = useHistory()
  const [activeTab, setActiveTab] = useState<React.Key>('all');
  const [columns, setColumns] = useState(getColumns(history, true))
  const [searchValue, setSearchValue] = useState('')

  const tabs = [
    {
      key: 'all',
      label: <span>所有{renderBadge(99, activeTab === 'all')}</span>,
    },
    {
      key: 'firstFiltration',
      label: <span>初筛{renderBadge(99, activeTab === 'firstFiltration')}</span>,
    },
    {
      key: 'departmentFiltration',
      label: <span>用人部门筛选{renderBadge(99, activeTab === 'departmentFiltration')}</span>,
    },
    {
      key: 'interview',
      label: <span>面试{renderBadge(99, activeTab === 'interview')}</span>,
    },
    {
      key: 'offerCommunication',
      label: <span>offer沟通{renderBadge(99, activeTab === 'offerCommunication')}</span>,
    },
    {
      key: 'toBeHired',
      label: <span>待入职{renderBadge(99, activeTab === 'toBeHired')}</span>,
    },
  ]

  const handleSearch = (value: string) => {
    console.log('srearchValue: ' + value);
    setSearchValue(value)
  }

  return (
      <Table
        columns={columns}
        params={{
          tab: activeTab,
          search: searchValue
        }}
        request={async (
          // 第一个参数 params 查询表单和 params 参数的结合
          // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
          params: T & {
            pageSize: number;
            current: number;
          },
        ) => {
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const {data, success, total} = await getCandidates(params)

          // 返回数据格式：
          // {
          //   data,
          //   // success 请返回 true，
          //   // 不然 table 会停止解析数据，即使有数据
          //   success,
          //   // 不传会使用 data 的长度，如果是分页一定要传
          //   total,
          // };

          return {
            data,
            success,
            total,
          };
        }}
        rowSelection={{
          selections: true,
        }}
        toolbar={{
          menu: {
            type: 'tab',
            activeKey: activeTab,
            items: tabs,
            onChange: (key) => {
              if (activeTab === 'all' && key !== 'all') {
                setColumns(getColumns(history, false))
              }
              if (activeTab !== 'all' && key === 'all') {
                setColumns(getColumns(history, true))
              }
              setActiveTab(key as string);
              setSearchValue(key as string)
            },
          },
          actions: [
            renderSearch(handleSearch),
          ],
        }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={24}>
            <span>
              已选 {selectedRowKeys.length} 项
              <a style={{ margin: '0 4px 0 8px' }} onClick={onCleanSelected}>
                取消选择
              </a>
            </span>
          </Space>
        )}
        tableAlertOptionRender={() => (
          // TODO: 实现多选控制
          <Space size={16}>
            <Button type="link">通过</Button>
            <Button type="link" danger>淘汰</Button>
          </Space>
        )}
        scroll={{ x: 1300 }}
        pagination={{
          position: ['bottomCenter']
        }}
        options={false}
        search={false}
        cardBordered
        rowKey="key"
      />
  )
};

export default Workplace;
