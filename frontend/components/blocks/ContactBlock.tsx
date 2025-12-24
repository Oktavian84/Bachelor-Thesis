"use client";

import { useState, type FormEvent } from "react";
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
      setShowForm(false);

      setTimeout(() => setSubmitStatus(null), 3000);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFocus = (fieldName: string) => setFocusedField(fieldName);
  const handleBlur = () => setFocusedField(null);

  return (
    <section className="w-full flex items-center pt-30 bg-white text-black dark:bg-black dark:text-white">
      <div className="w-full flex flex-col xl:flex-row">
        <div className="w-[95%] xl:w-[55%] h-[90vh] xl:h-[70vh] -mt-30 lg:-mt-20 xl:mt-0 mb-10 xl:mb-0 order-2 xl:order-1">
          {!showForm && image ? (
            <div className="relative w-full h-full rounded-tr-[8rem] rounded-br-[8rem] overflow-hidden">
              <StrapiImage
                src={image.url}
                alt={image.alternativeText || "Contact image"}
                fill
                className="object-cover"
              />

              {submitStatus === "success" && (
                <div className="absolute top-0 right-10 xl:left-10 md:left-0 md:right-0 p-6 text-center">
                  <p className="font-caudex text-2xl lg:text-4xl text-black dark:text-white">
                    Thank you, we will get back to you soon!
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="relative rounded-tr-[8rem] rounded-br-[8rem] p-12 h-full flex flex-col justify-center overflow-hidden">
              {image && (
                <>
                  <div className="absolute inset-0 z-0">
                    <StrapiImage
                      src={image.url}
                      alt={image.alternativeText || "Contact image"}
                      fill
                      className="object-cover opacity-30"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40 z-0" />
                </>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-6 relative z-10">
                {submitStatus === "error" && (
                  <div className="bg-red-100 border border-red-400 text-red-700 font-caudex px-4 py-3 rounded-lg">
                    Failed to send message. Please try again.
                  </div>
                )}

                <div className="max-w-fit mx-auto">
                  <p className="font-caudex text-center text-2xl lg:text-3xl mb-10 md:mb-15 mt-4 text-black dark:text-white">
                    Please fill in your information and a contact message.
                  </p>

                  <div>
                    <label htmlFor="name" className="block font-caudex text-xl mb-2 text-black dark:text-white">
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
                      className="shadow-sm shadow-black"
                    />
                  </div>

                  <div className="mt-6">
                    <label htmlFor="email" className="block font-caudex text-xl mb-2 text-black dark:text-white">
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
                      className="shadow-sm shadow-black"
                    />
                  </div>

                  <div className="mt-6">
                    <label htmlFor="message" className="block font-caudex text-xl mb-2 text-black dark:text-white">
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
                      className="shadow-sm shadow-black"
                    />
                  </div>

                  <div className="flex gap-4 justify-start sm:justify-end mt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-white text-black font-caudex px-4 sm:px-8 py-1 sm:py-2 rounded-lg text-xl font-bold border border-black hover:bg-black hover:text-white hover:scale-110 transition-all duration-300 ease-in-out shadow-sm shadow-black disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="bg-white text-black font-caudex px-4 sm:px-8 py-1 sm:py-2 rounded-lg text-xl font-bold border border-black hover:bg-black hover:text-white hover:scale-110 transition-all duration-300 ease-in-out shadow-sm shadow-black disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="w-full xl:w-[35%] -mt-20 mb-20 xl:mb-0 xl:mt-0 ml-auto order-1 xl:order-2">
          <div className="p-6 xl:p-12 h-[75vh] flex flex-col justify-center items-center xl:items-start">
            <h2 className="font-caudex text-4xl font-bold mb-8 text-center xl:text-left text-black dark:text-white">
              {headline}
            </h2>

            <div className="font-caudex text-2xl sm:text-3xl leading-relaxed mb-14 whitespace-pre-line text-center xl:text-left text-black dark:text-white">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>

            <div className="flex flex-col items-center xl:items-start mb-12">
              {cta && cta.length > 0 && (
                <div className="flex gap-4 mb-8 sm:mb-12">
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
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      ) : index === 1 ? (
                        <svg className="w-8 h-8 fill-black" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      ) : (
                        <span className="text-sm text-black dark:text-white">{link.text}</span>
                      )}
                    </Link>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowForm(true)}
                className={`font-caudex px-20 py-2 rounded-lg text-xl font-bold border hover:scale-110 shadow-sm transition-all duration-300 ease-in-out bg-black text-white border-black hover:bg-white hover:text-black hover:border-white shadow-black dark:border-white dark:shadow-white ${
                  showForm ? "invisible pointer-events-none transition-none" : "visible"
                }`}
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
