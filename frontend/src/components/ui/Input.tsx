import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm 
          placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
          focus:border-blue-500 ${error ? 'border-red-500' : ''} ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </>
  );
};

export default Input;