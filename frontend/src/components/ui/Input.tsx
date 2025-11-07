import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { ComponentBaseProps } from '../../types';

interface InputProps extends ComponentBaseProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  error,
  label,
  helperText,
  leftIcon,
  rightIcon,
  className,
  ...props
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label
          className="block text-sm font-medium"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={cn(
            "w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error ? "border-red-500 focus:ring-red-500" : "border-[var(--color-border)]",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          style={{
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text-primary)'
          }}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p
          className={cn(
            "text-sm",
            error ? "text-red-500" : "text-[var(--color-text-secondary)]"
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;