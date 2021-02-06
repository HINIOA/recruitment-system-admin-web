import React from 'react';
import ProForm, {
  DrawerForm,
  ProFormText,
  ProFormDigit,
  ProFormSelect,
  ProFormRadio,
  ProFormTextArea,
} from '@ant-design/pro-form';
import type { FormInstance } from '@ant-design/pro-form';

interface JobEditDrawer {
  formRef: React.MutableRefObject<FormInstance<any> | undefined> | undefined;
  formType: 'create' | 'edit';
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  onFinish: ((formData: any) => Promise<boolean | void>) &
    ((formData: any) => Promise<boolean | void>);
}

const EditDrawer: React.FC<JobEditDrawer> = (props) => {
  const { formRef, formType, visible, onVisibleChange, onFinish } = props;

  return (
    <DrawerForm
      formRef={formRef}
      width={514}
      onVisibleChange={onVisibleChange}
      title={formType === 'create' ? '创建职位' : '编辑职位'}
      visible={visible}
      drawerProps={{
        maskClosable: false,
      }}
      onFinish={onFinish}
    >
      <ProForm.Group>
        <ProFormText
          width="sm"
          name="name"
          label="职位名称"
          placeholder="请输入"
          rules={[{ required: true, message: '请输入职位名称' }]}
        />
        <ProFormSelect
          width="sm"
          options={[
            {
              value: '研发类',
              label: '研发类',
            },
            {
              value: '职能类',
              label: '职能类',
            },
            {
              value: '全职',
              label: '全职',
            },
            {
              value: '实习',
              label: '实习',
            },
          ]}
          mode="multiple"
          name="types"
          label="职位类型"
          rules={[{ required: true, message: '请选择职位类型' }]}
        />
      </ProForm.Group>
      <ProFormRadio.Group
        options={[
          {
            value: 'A部门',
            label: 'A部门',
          },
          {
            value: 'B部门',
            label: 'B部门',
          },
          {
            value: 'C部门',
            label: 'C部门',
          },
          {
            value: 'D部门',
            label: 'D部门',
          },
        ]}
        width="xl"
        name="department"
        label="所属部门"
        rules={[{ required: true, message: '请选择所属部门' }]}
      />
      <ProForm.Group>
        <ProFormSelect
          options={[
            {
              value: '广东·深圳市',
              label: '广东·深圳市',
            },
            {
              value: '北京市',
              label: '北京市',
            },
            {
              value: '上海市',
              label: '上海市',
            },
            {
              value: '浙江·杭州市',
              label: '浙江·杭州市',
            },
          ]}
          width="sm"
          name="location"
          label="工作地点"
          rules={[{ required: true, message: '请选择工作地点' }]}
        />
        <ProFormDigit
          width="sm"
          name="recruitNumber"
          min={1}
          label="待招人数"
          rules={[{ required: true, message: '请输入待招人数' }]}
        />
      </ProForm.Group>
      <ProFormTextArea
        width="xl"
        name="desc"
        label="职位描述"
        rules={[{ required: true, message: '请输入职位描述' }]}
      />
    </DrawerForm>
  );
};

export default EditDrawer;
