import classNames from 'classnames';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: 'small' | 'default'
  label?: string | string[]
}

const Switch = ({
  checked,
  onChange,
  disabled = false,
  className = '',
  label = '',
  size = 'default'
}: SwitchProps) => {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };
  const sizeStyles = size === 'small' ? ['h-6 w-11', 'h-5 w-5'] : ['h-8 w-16', 'h-7 w-7']
  const title = (typeof label === 'string') ? label : label[checked ? 0 : 1]
  return (
    <div className={`flex items-center ${size === 'small' ? 'gap-2' : 'gap-4'}`}>
      <div className={classNames(' text-gray-600 dark:text-gray-300', size === 'small' ? ' text-sm' : ' text-lg')}>{title}</div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        className={`
        relative inline-flex flex-shrink-0 cursor-pointer rounded-full
        border-2 border-transparent transition-colors duration-200 ease-in-out 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${checked ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-gray-600'}
        ${disabled ? 'cursor-not-allowed opacity-50' : ''}
         dark:focus:ring-blue-500 dark:focus:ring-offset-gray-800
        ${className}
        ${sizeStyles[0]}
      `}
      >
        <span
          aria-hidden="true"
          className={`
          pointer-events-none inline-block transform rounded-full 
          bg-white shadow-lg ring-0 transition duration-200 ease-in-out
          ${checked ? (size === 'small' ? 'translate-x-5' : 'translate-x-8') : 'translate-x-0'}
          dark:bg-gray-200
          ${sizeStyles[1]}
        `}
        />
      </button>
    </div>
  );
};

export default Switch;