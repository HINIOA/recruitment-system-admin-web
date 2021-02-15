import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import selectOptions from '../../../../config/selectOptions';

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
    const options: {
      value: string;
      label: string;
    }[] = type === 'types' ? selectOptions.type : selectOptions.department;

    setOptions(options);
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
