/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useRef, useState } from 'react';
import Table, { ProColumns } from '@ant-design/pro-table';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  queryAddInterviewer,
  queryDeleteInterviewer,
  queryInterviewers,
  queryUpdateInterviewer,
} from '@/services/interviewers';
import type { Interviewer } from '@/models/interviewer';
import SearchSelector from './Jobs/components/SearchSelector';

const { confirm } = Modal;
const { Option } = Select;
let openModal: (type: 'edit' | 'add', name?: Interviewer) => void;

const handleClickAdd = () => {
  openModal('add');
};

const handleClickDelete = (interviewer: Interviewer, action) => {
  confirm({
    title: `确定删除${interviewer.name}吗？`,
    icon: <ExclamationCircleOutlined />,
    okText: '是',
    okType: 'danger',
    cancelText: '否',
    onOk: async () => {
      const res = await queryDeleteInterviewer(interviewer._id);
      console.log('delete', res);
      action.reload();
    },
  });
};

const handleClickEdit = (interviewer: Interviewer) => {
  openModal('edit', interviewer);
};

const columns: ProColumns[] = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '部门',
    dataIndex: 'department',
    key: 'department',
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
    title: '操作',
    valueType: 'option',
    fixed: 'right',
    render: (_, rowData, __, action) => [
      <Button
        key="edit"
        type="link"
        icon={<EditOutlined />}
        onClick={() => handleClickEdit(rowData)}
        style={{ padding: 0 }}
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

const Interviewers: React.FC = () => {
  const actionRef = useRef();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [formType, setFormType] = useState<'edit' | 'add'>('add');
  const [form] = Form.useForm();
  const typeTitle = {
    add: '添加',
    edit: '编辑',
  };

  openModal = (type, interviewer) => {
    if (type === 'edit' && interviewer) {
      const { name, department } = interviewer;
      form.setFieldsValue({ name, department });
    }
    setFormType(type);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const { success } =
      formType === 'add'
        ? await queryAddInterviewer(form.getFieldsValue())
        : await queryUpdateInterviewer(form.getFieldsValue());

    if (success) {
      message.success(`${typeTitle[formType]}成功`);
      actionRef.current && actionRef.current.reload();
    } else {
      message.error(`${typeTitle[formType]}失败`);
    }

    setIsModalVisible(false);
  };

  return (
    <>
      <Table
        headerTitle="面试官列表"
        actionRef={actionRef}
        rowKey="_id"
        columns={columns}
        request={async (params = {}) => {
          const { data, total } = await queryInterviewers(params);

          return {
            data,
            total,
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
          <Button key="primary" type="primary" icon={<PlusOutlined />} onClick={handleClickAdd}>
            添加面试官
          </Button>,
        ]}
        pagination={{
          defaultPageSize: 10,
          position: ['bottomCenter'],
        }}
        dateFormatter="string"
      />
      <Modal
        title={`${typeTitle[formType]}面试官`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okButtonProps={{ title: '提交' }}
      >
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} form={form}>
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input disabled={formType === 'edit'} placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item name="department" label="部门" rules={[{ required: true }]}>
            <Select placeholder="请选择部门" allowClear>
              <Option value="A">A部门</Option>
              <Option value="B">B部门</Option>
              <Option value="C">C部门</Option>
              <Option value="D">D部门</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Interviewers;
