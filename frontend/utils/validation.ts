import { z } from 'zod';

export function sanitizeMessage(message: string): string {
  return message
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<(object|embed)\b[^<]*(?:(?!<\/(object|embed)>)<[^<]*)*<\/(object|embed)>/gi, '')
    .trim();
}

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .min(3, 'Name must be at least 3 characters')
  .regex(/^[a-zA-ZåäöÅÄÖ\s-]+$/, 'Name can only contain letters, spaces, and hyphens')
  .trim();

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .trim()
  .toLowerCase();

export const messageSchema = z
  .string()
  .min(1, 'Message is required')
  .min(10, 'Message must be at least 10 characters')
  .max(5000, 'Message must be less than 5000 characters')
  .transform((val) => sanitizeMessage(val));

export const exhibitionFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
});

export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  message: messageSchema,
});

export const checkoutFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: z.string().min(1, 'Address is required').trim(),
  city: z.string().min(1, 'City is required').trim(),
  postalCode: z.string().min(1, 'Postal code is required').trim(),
  country: z.string().min(1, 'Country is required').trim(),
});

export type ExhibitionFormData = z.infer<typeof exhibitionFormSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

