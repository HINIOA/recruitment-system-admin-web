import React, { useState, useRef } from 'react';
import {
  EyeOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Button, Modal, message } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { FormInstance } from '@ant-design/pro-form';
import SearchSelector from './components/SearchSelector';
import ViewModal from './components/ViewModal';
import EditDrawer from './components/EditDrawer';
import { queryJobs, deleteJob, addJob, updateJob } from '../../services/jobs';
import type { Job } from '../../models/job';

const { confirm } = Modal;

let openViewModal: () => void;
let modalData: Job;
let openFormDrawer: () => void;
let formType: 'create' | 'edit';

const handleClickView = (job) => {
  modalData = job;
  openViewModal();
};

const handleClickCreate = () => {
  formType = 'create';
  openFormDrawer();
};

const handleClickDelete = (job: Job, action) => {
  confirm({
    title: `确定取消${job.department}的${job.name}岗位招聘吗？`,
    icon: <ExclamationCircleOutlined />,
    okText: '是',
    okType: 'danger',
    cancelText: '否',
    onOk: async () => {
      const { isSuccess, message: messageText } = await deleteJob(job.id);

      if (isSuccess) {
        message.success(messageText);
        action.reload();
      }
    },
  });
};

const handleClickEdit = (job: Job) => {
  formType = 'edit';
  openFormDrawer(job);
};

const columns: ProColumns[] = [
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '部门',
    dataIndex: 'department',
    renderFormItem: (_, { type, defaultRender, ...rest }) => {
      return (
        <SearchSelector
          {...rest}
          state={{
            type: 'department',
            multiple: false,
          }}
        />
      );
    },
  },
  {
    title: '工作地点',
    key: 'location',
    dataIndex: 'location',
    search: false,
  },
  {
    title: '类型',
    key: 'types',
    dataIndex: 'types',
    render: (_, rowData) => <span>{rowData.types ? rowData.types.join('｜') : ''}</span>,
    renderFormItem: (item, { type, defaultRender, ...rest }) => {
      if (type === 'form') {
        return null;
      }

      return (
        <SearchSelector
          {...rest}
          state={{
            type: 'types',
            multiple: true,
          }}
        />
      );
    },
  },
  {
    title: '待招人数',
    key: 'recruitNumber',
    dataIndex: 'recruitNumber',
    search: false,
  },
  {
    title: '创建时间',
    key: 'cTime',
    dataIndex: 'cTime',
    valueType: 'date',
    search: false,
  },
  {
    title: '操作',
    valueType: 'option',
    fixed: 'right',
    render: (_, rowData, __, action) => [
      <Button
        key="view"
        type="text"
        style={{ paddingLeft: 0 }}
        icon={<EyeOutlined />}
        onClick={() => handleClickView(rowData)}
      >
        查看
      </Button>,
      <Button
        key="edit"
        type="link"
        icon={<EditOutlined />}
        onClick={() => handleClickEdit(rowData)}
      >
        编辑
      </Button>,
      <Button
        key="delete"
        type="link"
        icon={<DeleteOutlined />}
        onClick={() => handleClickDelete(rowData, action)}
        danger
      >
        删除
      </Button>,
    ],
  },
];

const renderFormDrawer = ({ job, formRef, visible, setVisible, tableActionRef }) => {
  if (formRef.current) {
    if (formType === 'edit' && job) {
      formRef.current.setFieldsValue(job);
    } else {
      formRef.current.resetFields();
    }
  }

  return (
    <EditDrawer
      key={job ? job['_id'] : Date.now()}
      formRef={formRef}
      formType={formType}
      visible={visible}
      onVisibleChange={setVisible}
      onFinish={async (value) => {
        const newJob = { ...value };

        if (formType === 'create') {
          newJob['cTime'] = new Date();
        } else {
          Object.keys(job).forEach((key) => {
            if (!newJob[key]) newJob[key] = job[key];
          });
        }

        const { success, message: messageText } =
          formType === 'create' ? await addJob(newJob) : await updateJob(newJob);

        if (success) {
          tableActionRef.current.reload();
          message.success(messageText);
          return true;
        }

        return false;
      }}
    />
  );
};

const Jobs: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const formRef = useRef<React.MutableRefObject<FormInstance<any> | undefined>>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [editingJob, setEditingJob] = useState<Job>();

  openViewModal = () => setModalVisible(true);
  openFormDrawer = (job?: Job) => {
    if (formType === 'edit' && job) setEditingJob(job);
    setDrawerVisible(true);
  };

  return (
    <>
      <ProTable<Job>
        headerTitle="职位列表"
        rowKey="_id"
        columns={columns}
        actionRef={actionRef}
        request={async (params = {}) => {
          const { data } = await queryJobs(params);

          return {
            data,
            success: true,
          };
        }}
        search={{
          labelWidth: 'auto',
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
              };
            }
            return values;
          },
        }}
        options={false}
        toolBarRender={() => [
          <Button key="create" type="primary" icon={<PlusOutlined />} onClick={handleClickCreate}>
            创建职位招聘
          </Button>,
        ]}
        pagination={{
          defaultPageSize: 10,
          position: ['bottomCenter'],
        }}
        dateFormatter="string"
      />
      <ViewModal visible={modalVisible} job={modalData} onClose={() => setModalVisible(false)} />
      {formType &&
        renderFormDrawer({
          job: editingJob,
          formRef,
          visible: drawerVisible,
          setVisible: setDrawerVisible,
          tableActionRef: actionRef,
        })}
    </>
  );
};

export default Jobs;
