import React, { ReactElement, useState } from 'react';
import { useParams } from 'umi';
import { Descriptions, Image, Steps, Button, Space, Modal } from 'antd';
import Card from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import {
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import styles from './index.scss';
import { queryCandidate, operateCandidates } from '../../services/candidate';
import { Candidate, Operation, Status } from '../../models/candidate';

const { Step } = Steps;
const { confirm } = Modal;

const CandidateDetail: React.FC = () => {
  const params = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | Record<string, never>>({});
  const [hasQuery, setHasQuery] = useState<boolean>(false);

  // 获取候选人数据
  if (!hasQuery)
    queryCandidate(params.id).then((res) => {
      setCandidate(res.data);
      setHasQuery(true);
    });

  const handleClickPass = () => {
    confirm({
      title: `确认${candidate.name}通过吗？`,
      icon: <ExclamationCircleOutlined />,
      okText: '是',
      cancelText: '否',
      onOk() {
        operateCandidates([candidate.id], Operation.PASS).then((data) =>
          setCandidate(data.candidates[0]),
        );
      },
    });
  };

  const handleClickObsolete = () => {
    confirm({
      title: `确定淘汰${candidate.name}吗？`,
      icon: <ExclamationCircleOutlined />,
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk() {
        operateCandidates([candidate.id], Operation.OBSOLETE).then((data) =>
          setCandidate(data.candidates[0]),
        );
      },
    });
  };

  const renderOperationButtons = (): ReactElement[] => {
    const buttons: ReactElement[] = [];

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    candidate.operations &&
      candidate.operations.forEach((operation) => {
        const props: any = {
          key: operation,
          type: 'primary',
          block: true,
        };
        let text: string = '';

        // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
        switch (operation) {
          case Operation.PASS:
            props.icon = <CheckOutlined />;
            props.onClick = handleClickPass;
            text = '通过';
            break;
          case Operation.OBSOLETE:
            props.danger = true;
            props.icon = <CloseOutlined />;
            props.onClick = handleClickObsolete;
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

  return (
    <PageContainer
      ghost
      fixedHeader
      header={{
        title: candidate.name,
        ghost: false,
        onBack: () => window.history.back(),
      }}
      content={
        <Descriptions column={4}>
          <Descriptions.Item label="投递职位">{candidate.job}</Descriptions.Item>
          <Descriptions.Item label="手机号码">{candidate.phone}</Descriptions.Item>
          <Descriptions.Item label="邮箱地址">{candidate.email}</Descriptions.Item>
          <Descriptions.Item label="最高学历">{candidate.education}</Descriptions.Item>
        </Descriptions>
      }
    >
      <Card split="vertical" className={styles.container} bordered>
        <Card colSpan="210px">
          <div className={styles.side}>
            <Steps
              current={candidate.currentLink - 1}
              status={candidate.status === Status.OBSOLETE ? 'error' : 'process'}
              direction="vertical"
              className={styles.steps}
            >
              <Step title="初筛" />
              <Step title="用人部门筛选" />
              <Step title="面试" />
              <Step title="offer沟通" />
              <Step title="待入职" />
            </Steps>
            {candidate.status !== Status.OBSOLETE && (
              <Space direction="vertical">{renderOperationButtons()}</Space>
            )}
          </div>
        </Card>
        <Card title="简历" className={styles.content} headerBordered>
          <div className={styles.resumeContainer}>
            <Image src={candidate.resumeUrl} />
          </div>
        </Card>
      </Card>
    </PageContainer>
  );
};

export default CandidateDetail;
