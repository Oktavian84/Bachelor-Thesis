import { ZodError } from 'zod';

export function formatZodErrors<T extends Record<string, unknown>>(
  error: ZodError
): Partial<Record<keyof T, string>> {
  const fieldErrors: Partial<Record<keyof T, string>> = {};
  error.issues.forEach((issue) => {
    if (issue.path[0]) {
      fieldErrors[issue.path[0] as keyof T] = issue.message;
    }
  });
  return fieldErrors;
}

export function getInputValue(
  value: string,
  hasError: boolean,
  isFocused: boolean
): string {
  return isFocused || !hasError ? value : '';
}

export function getInputPlaceholder(
  value: string,
  error: string | undefined,
  defaultPlaceholder: string,
  isFocused: boolean
): string {
  if (!value && error && !isFocused) return error;
  if (!value) return defaultPlaceholder;
  return '';
}

