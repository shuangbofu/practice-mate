import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  size?: 'small' | 'default'
}

const Button = ({ children, className = '', size = 'default', ...props }: ButtonProps) => {
  const baseStyles = `
    font-medium 
    rounded-md 
    transition-colors 
    duration-200 
    focus:ring-4 
    focus:outline-none
    text-white 
    bg-blue-700 
    hover:bg-blue-800 
    focus:ring-blue-300 
    dark:bg-blue-600 
    dark:hover:bg-blue-700 
    dark:focus:ring-blue-800
  `;
  const sizeStyles = size === 'small' ? `px-3 py-1 text-sm` : 'px-6 py-2 text-base'

  const disabledStyles = `
    opacity-50 
    cursor-not-allowed
  `;

  return (
    <button
      type="button"
      className={`
        ${baseStyles}
        ${sizeStyles}
        ${className}
        ${props.disabled ? disabledStyles : ''}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;