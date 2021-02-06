import type { Job } from '@/models/job';
import React from 'react';
import { Modal, Descriptions } from 'antd';

interface JobViewModalProps {
  job: Job;
  visible: boolean;
  onClose: () => void;
}

const ViewModal: React.FC<JobViewModalProps> = (props) => {
  const { job, visible, onClose } = props;

  return job ? (
    <Modal
      title="职位详情"
      centered
      visible={visible}
      onOk={onClose}
      onCancel={onClose}
      width={1000}
      footer={null}
    >
      <Descriptions bordered>
        <Descriptions.Item label="名称">{job.name}</Descriptions.Item>
        <Descriptions.Item label="部门">{job.department}</Descriptions.Item>
        <Descriptions.Item label="类型">{job.types.join('｜')}</Descriptions.Item>
        <Descriptions.Item label="工作地点">{job.location}</Descriptions.Item>
        <Descriptions.Item label="待招人数">{job.recruitNumber}</Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {new Date(job.c_time).toLocaleDateString()}
        </Descriptions.Item>
        <Descriptions.Item label="职位描述">{job.desc}</Descriptions.Item>
      </Descriptions>
    </Modal>
  ) : null;
};

export default ViewModal;
