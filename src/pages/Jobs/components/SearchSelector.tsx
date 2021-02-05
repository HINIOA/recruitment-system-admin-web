import React, { useState, useEffect } from 'react';
import { Select } from 'antd';

const SearchSelector: React.FC<{
  state: {
    type: string;
    multiple: boolean;
  };
  /** Value 和 onChange 会被自动注入 */
  value?: string;
  onChange?: (value: string) => void;
}> = (props) => {
  const { state } = props;
  const { type, multiple } = state;
  const [innerOptions, setOptions] = useState<
    {
      label: React.ReactNode;
      value: string;
    }[]
  >([]);

  useEffect(() => {
    if (type === 'types')
      setOptions([
        {
          label: '全职',
          value: '全职',
        },
        {
          label: '实习',
          value: '实习',
        },
        {
          label: '研发类',
          value: '研发类',
        },
        {
          label: '职能类',
          value: '职能类',
        },
      ]);
    else
      setOptions([
        {
          label: 'A部门',
          value: 'A部门',
        },
        {
          label: 'B部门',
          value: 'B部门',
        },
        {
          label: 'C部门',
          value: 'C部门',
        },
        {
          label: 'D部门',
          value: 'D部门',
        },
      ]);
  }, [JSON.stringify(state)]);

  return (
    <Select
      mode={multiple ? 'multiple' : undefined}
      allowClear
      options={innerOptions}
      value={props.value}
      onChange={props.onChange}
    />
  );
};

export default SearchSelector;
