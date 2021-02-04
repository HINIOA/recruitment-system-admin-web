import React, { useState, useRef } from 'react';
import Table from '@ant-design/pro-table';
import { Input, Space, Button, Badge, Tag, Modal } from 'antd';
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useHistory } from 'umi';
import type { History } from 'umi';
import { queryCandidates, passCandidates, obsoleteCandidates } from '../services/candidate';
// import { getAuthority } from '../utils/authority';

const { Search } = Input;
const { confirm } = Modal;

interface Tab {
  key: React.Key;
  label: React.ReactNode;
}

interface ActionType {
  reload: (resetPageIndex?: boolean) => void;
  reloadAndRest: () => void;
  reset: () => void;
  clearSelected?: () => void;
  startEditable: (rowKey: React.Key) => boolean;
  cancelEditable: (rowKey: React.Key) => boolean;
}

// const authority = getAuthority();

const renderSearch = (handleSearch, handleSearchChange) => (
  <div style={{ paddingRight: '1rem' }}>
    <Search
      placeholder="搜索候选人"
      onSearch={handleSearch}
      onChange={handleSearchChange}
      size="large"
      allowClear
      enterButton
    />
  </div>
);

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

const handelClickPass = (candidates, tableActions) => {
  confirm({
    title: `确认${candidates.map((item) => item.name).join('，')}通过吗？`,
    icon: <ExclamationCircleOutlined />,
    okText: '是',
    cancelText: '否',
    onOk() {
      const ids = candidates.map((item) => item.id);

      passCandidates(ids).then((res) => {
        if (res.success) tableActions.reload();
      });
    },
  });
};

const handelClickObsolete = (candidates, tableActions) => {
  confirm({
    title: `确定淘汰${candidates.map((item) => item.name).join('，')}吗？`,
    icon: <ExclamationCircleOutlined />,
    okText: '是',
    okType: 'danger',
    cancelText: '否',
    onOk() {
      const ids = candidates.map((item) => item.id);

      obsoleteCandidates(ids).then((res) => {
        if (res.success) tableActions.reload();
      });
    },
  });
};

// TODO:  判断当前用户是否有权限操作该候选人
const hasRights = (candidateStep: string, candidateStatus: string) => {
  // const isHrHaveRights =
  //   authority.includes('admin') &&
  //   (candidateStatus === 'firstFiltration' || candidateStatus === 'offerCommunication');
  // const isInterviewerHaveRights =
  //   authority.includes('user') &&
  //   (candidateStatus === 'departmentFiltration' || candidateStatus === 'interview');

  // return isHrHaveRights || isInterviewerHaveRights;
  return candidateStatus !== 'obsolete';
};

const getColumns = (router: History, includeStatusCol: boolean) => {
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
      fixed: 'right',
      render: (_, rowData, __, action) => {
        const optionDoms = [
          <Button
            key="view"
            icon={<EyeOutlined />}
            onClick={() => router.push(`/candidate/${rowData.id}`)}
          >
            查看
          </Button>,
        ];

        if (hasRights(rowData.steps, rowData.status))
          optionDoms.push(
            <Button
              key="pass"
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => handelClickPass([rowData], action)}
            >
              通过
            </Button>,
            <Button
              key="obsolete"
              type="primary"
              icon={<CloseOutlined />}
              onClick={() => handelClickObsolete([rowData], action)}
              danger
            >
              淘汰
            </Button>,
          );

        return optionDoms;
      },
    },
  ];
  if (!includeStatusCol) return columns;

  const stepColumn = {
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
        obsolete: {
          name: '已淘汰',
          color: 'red',
        },
      };
      const { name, color } = rowData.status === 'obsolete' ? map.obsolete : map[rowData.step];

      return (
        <Space>
          <Tag color={color} key={name}>
            {name}
          </Tag>
        </Space>
      );
    },
  };

  columns.splice(3, 0, stepColumn);
  return columns;
};

const Candidates: React.FC = () => {
  const history = useHistory();
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<React.Key>('all');
  const [columns, setColumns] = useState(getColumns(history, true));
  const [searchValue, setSearchValue] = useState('');
  const [selectedRowsData, setSelectedRowsData] = useState<React.Key[]>([]);
  const refTableActions = useRef<ActionType>();

  const rowSelection = {
    onChange: (_, selectedRows: any[]) => {
      setSelectedRowsData(selectedRows);
    },
  };

  const generateAndSetTabs = (status) => {
    setTabs(
      status.map(({ key, name, count }) => {
        return {
          key,
          label: (
            <span>
              {name}
              {renderBadge(count, activeTab === key)}
            </span>
          ),
        };
      }),
    );
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleSearchChange = (e) => {
    if (!e.target.value) setSearchValue('');
  };

  return (
    <Table
      columns={columns}
      params={{
        tab: activeTab,
        search: searchValue,
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
        const { tableData, status, success, total } = await queryCandidates(params);
        const data = tableData.map((item) => {
          return { ...item, key: item.id };
        });

        generateAndSetTabs(status);

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
      actionRef={refTableActions}
      rowSelection={
        activeTab.toString() !== 'all' && activeTab.toString() !== 'obsolete'
          ? {
              ...rowSelection,
            }
          : false
      }
      toolbar={{
        menu: {
          type: 'tab',
          activeKey: activeTab,
          items: tabs,
          onChange: (key) => {
            if (activeTab === 'all' && key !== 'all') {
              setColumns(getColumns(history, false));
            }
            if (activeTab !== 'all' && key === 'all') {
              setColumns(getColumns(history, true));
            }
            setActiveTab(key as string);
          },
        },
        actions: [renderSearch(handleSearch, handleSearchChange)],
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
        <Space size={16}>
          <Button
            type="link"
            onClick={() => handelClickPass(selectedRowsData, refTableActions.current)}
          >
            通过
          </Button>
          <Button
            type="link"
            onClick={() => handelClickObsolete(selectedRowsData, refTableActions.current)}
            danger
          >
            淘汰
          </Button>
        </Space>
      )}
      scroll={{ x: 1300 }}
      pagination={{
        position: ['bottomCenter'],
      }}
      options={false}
      search={false}
      cardBordered
      rowKey="key"
    />
  );
};

export default Candidates;
