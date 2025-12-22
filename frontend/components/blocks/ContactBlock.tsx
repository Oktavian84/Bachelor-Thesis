"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import emailjs from "@emailjs/browser";
import { StrapiImage } from "../StrapiImage";
import type { ContactBlockProps } from "@/types";
import { contactFormSchema, type ContactFormData } from "@/utils/validation";
import { ZodError } from "zod";
import { formatZodErrors } from "@/utils/form-helpers";
import { FormInput } from "@/components/FormInput";

export function ContactBlock({
  headline,
  content,
  image,
  buttonText,
  cta,
}: Readonly<ContactBlockProps>) {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrors({});

    try {
      const validatedData = contactFormSchema.parse(formData);

      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error("EmailJS configuration is missing");
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: validatedData.name,
          from_email: validatedData.email,
          message: validatedData.message,
        },
        publicKey
      );

      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setErrors({});
  
      setTimeout(() => {
        setShowForm(false);
        setSubmitStatus(null);
      }, 3000);
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors(formatZodErrors<ContactFormData>(error));
      } else {
        console.error("EmailJS error:", error);
        setSubmitStatus("error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <section className="w-full bg-black flex items-center pt-30">
      <div className="w-full flex">
        <div className="w-[60%] h-[75vh]">
          {!showForm && image ? (
            <div className="relative w-full h-full rounded-tr-[8rem] rounded-br-[8rem] overflow-hidden">
              <StrapiImage
                src={image.url}
                alt={image.alternativeText || "Contact image"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="bg-white rounded-tr-[8rem] rounded-br-[8rem] p-12 h-full flex flex-col justify-center">
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {submitStatus === "success" && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                    Message sent successfully!
                  </div>
                )}
                {submitStatus === "error" && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    Failed to send message. Please try again.
                  </div>
                )}
                <div>
                  <label htmlFor="name" className="block text-black text-lg mb-2">
                    Name
                  </label>
                  <FormInput
                    name="name"
                    value={formData.name}
                    error={errors.name}
                    focusedField={focusedField}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    defaultPlaceholder="Enter your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-black text-lg mb-2">
                    Email
                  </label>
                  <FormInput
                    name="email"
                    value={formData.email}
                    error={errors.email}
                    focusedField={focusedField}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    defaultPlaceholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-black text-lg mb-2">
                    Message
                  </label>
                  <FormInput
                    name="message"
                    value={formData.message}
                    error={errors.message}
                    focusedField={focusedField}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    defaultPlaceholder="Enter your message (minimum 10 characters)"
                    isTextarea
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-black text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Send"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ name: "", email: "", message: "" });
                      setSubmitStatus(null);
                      setErrors({});
                    }}
                    disabled={isSubmitting}
                    className="bg-gray-300 text-black px-8 py-4 rounded-lg text-xl font-bold hover:bg-gray-400 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="w-[35%] ml-auto">
          <div className="p-12 h-[75vh] flex flex-col justify-center">
            <h2 className="text-white text-4xl font-bold mb-8">{headline}</h2>
            <div className="text-white text-base md:text-3xl text-center leading-relaxed mb-14 whitespace-pre-line">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
            {cta && cta.length > 0 && (
              <div className="flex gap-4 justify-center mb-12">
                {cta.map((link, index) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    target={link.isExternal ? "_blank" : "_self"}
                    className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-all duration-300 ease-in-out shadow-sm shadow-black"
                    aria-label={link.text || (index === 0 ? "Facebook" : "Instagram")}
                  >
                    {index === 0 ? (
                      <svg className="w-8 h-8 fill-black" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    ) : index === 1 ? (
                      <svg className="w-8 h-8 fill-black" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    ) : (
                      <span className="text-white text-sm">{link.text}</span>
                    )}
                  </Link>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowForm(true)}
              className="bg-black text-white px-8 py-2 rounded-lg text-xl font-bold border border-white hover:bg-white hover:text-black hover:border-black hover:scale-110 transition-all duration-300 ease-in-out shadow-sm shadow-white self-center"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

