/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useState } from 'react';
import moment from 'moment';
import { DatePicker, Modal } from 'antd';
import { arrangeInterview } from '@/services/candidate';

// TODO：已安排时间不可选
// function range(start: number, end: number) {
//   const result = [];
//   for (let i = start; i < end; i++) {
//     result.push(i);
//   }
//   return result;
// }

function disabledDate(current) {
  return current < moment().endOf('day');
}

function disabledDateTime() {
  // return {
  //   disabledHours: () => range(0, 24),
  //   disabledMinutes: () => range(30, 60),
  // };
  return {};
}

const ArrangeInterviewDialog: React.FC<{
  visible: boolean;
  candidateId: string;
  onOk: () => void;
  onCancel: () => void;
}> = ({ visible, candidateId, onOk, onCancel }) => {
  const [value, setValue] = useState<Date>();

  const handleClickOk = () => {
    candidateId &&
      arrangeInterview([candidateId], value!).then(() => {
        onOk();
      });
  };

  return (
    <Modal title="安排面试" visible={visible} onOk={handleClickOk} onCancel={onCancel}>
      <DatePicker
        format="YYYY-MM-DD HH:mm"
        disabledDate={disabledDate}
        disabledTime={disabledDateTime}
        showTime={{ defaultValue: moment('00:00', 'HH:mm') }}
        placeholder="请选择面试时间"
        style={{ width: '100%' }}
        onChange={(date) => setValue(date._d)}
      />
    </Modal>
  );
};

export default ArrangeInterviewDialog;
