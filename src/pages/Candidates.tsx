import React, { useState, useRef, ReactElement } from 'react';
import Table from '@ant-design/pro-table';
import { Input, Space, Button, Badge, Tag, Modal } from 'antd';
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import { useHistory } from 'umi';
import type { History } from 'umi';
import { queryCandidates, operateCandidates } from '../services/candidate';
import { Candidate, Link, Operation, TabKey } from '@/models/candidate';

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

const handleClickPass = (candidates, tableActions) => {
  confirm({
    title: `确认${candidates.map((item) => item.name).join('，')}通过吗？`,
    icon: <ExclamationCircleOutlined />,
    okText: '是',
    cancelText: '否',
    onOk() {
      const ids = candidates.map((item) => item.id);

      operateCandidates(ids, Operation.PASS).then((res) => {
        if (res.success) tableActions.reload();
      });
    },
  });
};

const handleClickObsolete = (candidates, tableActions) => {
  confirm({
    title: `确定淘汰${candidates.map((item) => item.name).join('，')}吗？`,
    icon: <ExclamationCircleOutlined />,
    okText: '是',
    okType: 'danger',
    cancelText: '否',
    onOk() {
      const ids = candidates.map((item) => item.id);

      operateCandidates(ids, Operation.OBSOLETE).then((res) => {
        if (res.success) tableActions.reload();
      });
    },
  });
};

// TODO:  判断当前用户是否有权限操作该候选人
// const hasRights = (candidateStep: string, candidateStatus: string) => {};

const getOperationButtons = (candidate: Candidate, action: any): ReactElement[] => {
  const buttons: ReactElement[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  candidate.operations &&
    candidate.operations.forEach((operation) => {
      const props: any = {
        key: operation,
        type: 'primary',
      };
      let text: string = '';

      // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
      switch (operation) {
        case Operation.PASS:
          props.icon = <CheckOutlined />;
          props.onClick = () => handleClickPass([candidate], action);
          text = '通过';
          break;
        case Operation.OBSOLETE:
          props.danger = true;
          props.icon = <CloseOutlined />;
          props.onClick = () => handleClickObsolete([candidate], action);
          text = '淘汰';
          break;
        case Operation.RESCHEDULE:
          props.icon = <ScheduleOutlined />;
          text = '改期';
          break;
        case Operation.ARRANGE:
          props.icon = <ScheduleOutlined />;
          text = '安排';
          break;
      }

      buttons.push(<Button {...props}>{text}</Button>);
    });

  return buttons;
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
      dataIndex: 'cTime',
      key: 'cTime',
      valueType: 'date',
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      render: (_, rowData, __, action) => [
        <Button
          key="view"
          icon={<EyeOutlined />}
          onClick={() => router.push(`/candidate/${rowData.id}`)}
        >
          查看
        </Button>,
        ...getOperationButtons(rowData, action),
      ],
    },
  ];
  if (!includeStatusCol) return columns;

  const stepColumn = {
    title: '状态',
    key: 'status',
    render: (_, rowData) => {
      const map = {
        [Link.FIRST_FILTRATION]: {
          name: '初筛',
          color: 'orange',
        },
        [Link.DEPARTMENT_FILTRATION]: {
          name: '用人部门筛选',
          color: 'gold',
        },
        [Link.INTERVIEW]: {
          name: '面试',
          color: 'purple',
        },
        [Link.OFFER_COMMUNICATION]: {
          name: 'offer沟通',
          color: 'blue',
        },
        [Link.WAIT_FOR_HIRED]: {
          name: '待入职',
          color: 'green',
        },
      };
      const { name, color } = map[rowData.currentLink];

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

const Candidates: React.FC = () => {
  const history = useHistory();
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<React.Key>(TabKey.ALL_APPLIED);
  const [columns, setColumns] = useState(getColumns(history, true));
  const [searchValue, setSearchValue] = useState('');
  const refTableActions = useRef<ActionType>();

  const generateAndSetTabs = (tabsData) => {
    setTabs(
      tabsData.map(({ key, name, count }) => {
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
        name: searchValue,
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
        const response = await queryCandidates(params);
        const { tableData, tabs: tabsData, success, total } = response;

        generateAndSetTabs(tabsData);

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
          data: tableData,
          success,
          total,
        };
      }}
      actionRef={refTableActions}
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
            onClick={() => handleClickPass(selectedRowsData, refTableActions.current)}
          >
            通过
          </Button>
          <Button
            type="link"
            onClick={() => handleClickObsolete(selectedRowsData, refTableActions.current)}
            danger
          >
            淘汰
          </Button>
        </Space>
      )}
      scroll={{ x: 1300 }}
      pagination={{
        defaultPageSize: 10,
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
