import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import React, { forwardRef, useState } from 'react';

interface InputNumberProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  _size?: 'small' | 'default'
  showMax?: boolean;
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      value = 0,
      onValueChange,
      min = -Infinity,
      max = Infinity,
      step = 1,
      disabled = false,
      className = '',
      _size = 'default',
      showMax = false,
      ...props
    },
    ref
  ) => {
    const sizeClassNames = _size === 'small' ? ['text-xl w-6 px-4 py-2 ', 'px-3 py-1.5 w-16'] :
      ['text-2xl w-8 px-6 py-2 ', 'px-4 py-2 w-24']

    // 修改input的value处理逻辑
    const displayValue = showMax ? `${value}/${max}` : String(value);

    // 修改handleInputChange函数
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // 提取输入值中的数字部分
      const numericValue = inputValue.replace(/\/.*/, ''); // 移除斜杠及后面内容
      const parsedValue = parseFloat(numericValue);

      handleChange(isNaN(parsedValue) ? min : parsedValue);
    };

    // 添加聚焦/失焦处理
    const [isFocused, setIsFocused] = useState(false);
    const handleChange = (newValue: number) => {
      const clampedValue = Math.min(Math.max(newValue, min), max);
      if (!isNaN(clampedValue)) {
        onValueChange?.(clampedValue);
      }
    };

    // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   const inputValue = parseFloat(e.target.value);
    //   handleChange(isNaN(inputValue) ? min : inputValue);
    // };

    // 按钮控制组件
    const ButtonControl = ({
      onClick,
      disabled: btnDisabled,
      icon,
      position,
    }: {
      onClick: () => void;
      disabled: boolean;
      icon: React.ReactNode;
      position: 'left' | 'right';
    }) => (
      <button
        type="button"
        onClick={onClick}
        disabled={btnDisabled}
        className={`relative 
          ${sizeClassNames[0]} h-full flex items-center justify-center
          bg-gray-100 hover:bg-gray-200
          dark:bg-zinc-700 dark:hover:bg-zinc-600
          border-gray-300 dark:border-zinc-600
          transition-colors duration-200
          ${position === 'left' ?
            'border-r-0 rounded-l-lg' :
            'border-l-0 rounded-r-lg'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          text-zinc-700 dark:text-gray-200
          focus:outline-none focus:ring-2 focus:ring-blue-500
          dark:focus:ring-blue-600
        `}
      >
        {icon}
      </button>
    );

    return (
      <div className={`
        flex items-center rounded-lg overflow-hidden
        ${className}
      `}>
        <ButtonControl
          onClick={() => handleChange(value - step)}
          disabled={disabled || value <= min}
          icon={<MinusOutlined />}
          position="left"
        />
        <input
          {...props}
          ref={ref}
          type={!isFocused ? 'text' : "number"}
          value={isFocused ? String(value) : displayValue}
          min={min}
          max={max}
          step={step}
          onChange={handleInputChange}
          disabled={disabled}
          className={`
            flex-1 ${sizeClassNames[1]} w-24 min-w-0
            bg-white text-gray-900
            dark:bg-zinc-800 dark:text-gray-100
            border-0 focus:ring-2 focus:ring-blue-500
            dark:focus:ring-blue-600
            [appearance:textfield]
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
            ${disabled ?
              'bg-gray-100 dark:bg-zinc-700 cursor-not-allowed' :
              'dark:placeholder-gray-400'}
            transition-colors duration-200
          `}
          onFocus={(e) => {
            setIsFocused(true);
            if (showMax) {
              // 临时存储原始值
              const rawValue = displayValue.split('/')[0];
              e.target.value = rawValue;
            }
          }}
          onBlur={() => setIsFocused(false)}
        />

        <ButtonControl
          onClick={() => handleChange(value + step)}
          disabled={disabled || value >= max}
          icon={<PlusOutlined />}
          position="right"
        />
      </div>
    );
  }
);

InputNumber.displayName = 'InputNumber';

export default InputNumber;