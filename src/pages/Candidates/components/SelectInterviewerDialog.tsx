import { Modal, Select } from 'antd';
import React from 'react';

const { Option } = Select;

const SelectInterviewerDialog: React.FC<{
  isVisible: boolean;
  onOk: () => void;
  onCancel: () => void;
}> = (props) => {
  return (
    <Modal title="指定面试官" visible={props.isVisible} onOk={props.onOk} onCancel={props.onCancel}>
      <Select showSearch size="large" placeholder="请选择面试官" style={{ width: '100%' }}>
        <Option value="jack">张三</Option>
        <Option value="lucy">李四</Option>
        <Option value="tom">王五</Option>
      </Select>
    </Modal>
  );
};

export default SelectInterviewerDialog;
