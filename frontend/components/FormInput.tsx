"use client";

import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { getInputValue, getInputPlaceholder } from "@/utils/form-helpers";

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
  isTextarea?: boolean;
  className?: string;
}

interface FormInputProps extends BaseInputProps {
  isTextarea?: false;
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "name" | "value" | "onChange" | "onFocus" | "onBlur" | "disabled" | "placeholder" | "title" | "className"
  >;
}

interface FormTextareaProps extends BaseInputProps {
  isTextarea: true;
  textareaProps?: Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "name" | "value" | "onChange" | "onFocus" | "onBlur" | "disabled" | "placeholder" | "title" | "className"
  >;
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
    className,
  } = props;

  const isFocused = focusedField === name;
  const hasError = !!error;

  const displayValue = getInputValue(value, hasError, isFocused);
  const placeholder = getInputPlaceholder(value, error, defaultPlaceholder, isFocused);

  const base = [
    "w-full px-4 py-1 border rounded-lg disabled:opacity-50 focus:outline-none",
    "bg-white text-black border-gray-300 placeholder-gray-400 focus:border-black",
    "dark:bg-black/10 dark:text-white dark:border-white/20 dark:placeholder-white/50 dark:focus:border-white",
    hasError
      ? "border-red-500 placeholder-red-500 dark:placeholder-red-400"
      : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  const errorText = "text-red-500 dark:text-red-400";
  const overlayPad = "px-4 py-1";

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
          title={error || ""}
          className={base}
          rows={6}
          {...props.textareaProps}
        />
        {error && value && !isFocused && (
          <div className="absolute top-3 left-4 pointer-events-none">
            <span className={`${errorText} text-sm`}>{error}</span>
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
        title={error || ""}
        className={base}
        autoComplete="off"
        {...props.inputProps}
      />
      {error && value && !isFocused && (
        <div className={`absolute inset-0 ${overlayPad} pointer-events-none flex items-center`}>
          <span className={`${errorText} text-sm`}>{error}</span>
        </div>
      )}
    </div>
  );
}
