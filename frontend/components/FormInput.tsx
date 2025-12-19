'use client';

import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { getInputValue, getInputPlaceholder } from '@/utils/form-helpers';

type FormInputVariant = 'light' | 'dark';

interface BaseInputProps {
  name: string;
  value: string;
  error?: string;
  focusedField: string | null;
  onFocus: (fieldName: string) => void;
  onBlur: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  disabled?: boolean;
  defaultPlaceholder: string;
  variant?: FormInputVariant;
  isTextarea?: boolean;
}

interface FormInputProps extends BaseInputProps {
  isTextarea?: false;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'value' | 'onChange' | 'onFocus' | 'onBlur' | 'disabled' | 'placeholder' | 'title' | 'className' | 'style' | 'autoComplete' | 'data-checkout-input'>;
}

interface FormTextareaProps extends BaseInputProps {
  isTextarea: true;
  textareaProps?: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name' | 'value' | 'onChange' | 'onFocus' | 'onBlur' | 'disabled' | 'placeholder' | 'title' | 'className'>;
}

type FormInputComponentProps = FormInputProps | FormTextareaProps;

export function FormInput(props: FormInputComponentProps) {
  const {
    name,
    value,
    error,
    focusedField,
    onFocus,
    onBlur,
    onChange,
    disabled = false,
    defaultPlaceholder,
    variant = 'light',
  } = props;

  const isFocused = focusedField === name;
  const hasError = !!error;
  const displayValue = getInputValue(value, hasError, isFocused);
  const placeholder = getInputPlaceholder(value, error, defaultPlaceholder, isFocused);

  const isDark = variant === 'dark';

  const lightBaseClassName = `w-full px-4 py-3 border rounded-lg disabled:opacity-50 focus:outline-none ${
    hasError
      ? 'border-red-500 placeholder-red-500'
      : 'border-gray-300 placeholder-gray-400'
  } text-black focus:border-black bg-white`;

  const darkBaseClassName = `w-full px-4 py-2 border rounded disabled:opacity-50 focus:outline-none focus:border-white ${
    hasError
      ? 'border-red-500 placeholder-red-400'
      : 'border-white/20 placeholder-white/50'
  } text-white`;

  const inputClassName = isDark ? darkBaseClassName : lightBaseClassName;
  const errorTextColor = isDark ? 'text-red-400' : 'text-red-500';
  const errorOverlayPadding = isDark ? 'px-4 py-2' : 'px-4 py-3';

  if (props.isTextarea) {
    return (
      <div className="relative">
        <textarea
          id={name}
          name={name}
          value={displayValue}
          onChange={onChange}
          onFocus={() => onFocus(name)}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          title={error || ''}
          className={inputClassName}
          rows={6}
          {...props.textareaProps}
        />
        {error && value && !isFocused && (
          <div className="absolute top-3 left-4 pointer-events-none">
            <span className={`${errorTextColor} text-sm`}>{error}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        id={name}
        name={name}
        type="text"
        value={displayValue}
        onChange={onChange}
        onFocus={() => onFocus(name)}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        title={error || ''}
        className={inputClassName}
        style={isDark ? { backgroundColor: 'rgba(255, 255, 255, 0.1)' } : undefined}
        autoComplete={isDark ? 'off' : undefined}
        data-checkout-input={isDark ? 'true' : undefined}
        {...props.inputProps}
      />
      {error && value && !isFocused && (
        <div className={`absolute inset-0 ${errorOverlayPadding} pointer-events-none flex items-center`}>
          <span className={`${errorTextColor} text-sm`}>{error}</span>
        </div>
      )}
    </div>
  );
}

