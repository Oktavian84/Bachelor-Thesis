"use client";

import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { getInputValue, getInputPlaceholder } from "@/utils/form-helpers";
import { useTheme } from "@/contexts/ThemeContext";

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

  const { theme } = useTheme();
  const isLight = theme === "light";
  const isFocused = focusedField === name;
  const hasError = !!error;

  const displayValue = getInputValue(value, hasError, isFocused);
  const placeholder = getInputPlaceholder(value, error, defaultPlaceholder, isFocused);

  const borderClass = isLight 
    ? hasError 
      ? "border-red-500" 
      : "border-black focus:border-black"
    : hasError 
      ? "border-red-500" 
      : "border-white focus:border-white";

  const shadowClass = isLight
    ? "shadow-[0_0_0_1px_rgba(0,0,0,1)] focus:shadow-[0_0_0_2px_rgba(0,0,0,1)] shadow-black"
    : "shadow-[0_0_0_1px_rgba(255,255,255,1)] focus:shadow-[0_0_0_2px_rgba(255,255,255,1)] shadow-white";

  const textColorClass = isLight ? "text-black" : "text-white";
  const placeholderColorClass = hasError 
    ? "placeholder-red-500" 
    : isLight 
      ? "placeholder-gray-500" 
      : "placeholder-gray-400";

  const bgClass = isLight ? "bg-white" : "bg-black";

  const base = [
    "w-full px-4 py-1 rounded-lg disabled:opacity-50 focus:outline-none",
    "border",
    bgClass,
    textColorClass,
    borderClass,
    shadowClass,
    placeholderColorClass,
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  const errorText = isLight ? "text-red-500" : "text-red-400";
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
