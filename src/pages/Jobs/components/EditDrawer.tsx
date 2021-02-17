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
import selectOptions from '../../../../config/selectOptions';

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
          options={selectOptions.type}
          mode="multiple"
          name="types"
          label="职位类型"
          rules={[{ required: true, message: '请选择职位类型' }]}
        />
      </ProForm.Group>
      <ProFormRadio.Group
        options={selectOptions.department}
        width="xl"
        name="department"
        label="所属部门"
        rules={[{ required: true, message: '请选择所属部门' }]}
      />
      <ProForm.Group>
        <ProFormSelect
          options={selectOptions.location}
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
        name="description"
        label="职位描述"
        rules={[{ required: true, message: '请输入职位描述' }]}
      />
    </DrawerForm>
  );
};

export default EditDrawer;
