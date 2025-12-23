"use client";
import { useState, FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import { StrapiImage } from "../StrapiImage";
import type { ExhibitionBlockProps } from "@/types";
import { exhibitionFormSchema, type ExhibitionFormData } from "@/utils/validation";
import { ZodError } from "zod";
import { formatZodErrors } from "@/utils/form-helpers";
import { FormInput } from "@/components/FormInput";
import { useTheme } from "@/contexts/ThemeContext";

export function ExhibitionBlock({
  exhibition,
}: Readonly<ExhibitionBlockProps>) {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof ExhibitionFormData, string>>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { theme } = useTheme();
  const isLight = theme === "light";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrors({});

    try {
      const validatedData = exhibitionFormSchema.parse(formData);

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: validatedData.name,
          email: validatedData.email,
          exhibitionId: exhibition.documentId || exhibition.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `Failed to submit booking: ${response.status}`);
      }

      await response.json();
      
      setSubmitStatus("success");
      setFormData({ name: "", email: "" });
      setErrors({});
      setShowForm(false);

      setTimeout(() => {
        setSubmitStatus(null);
      }, 3000);
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors(formatZodErrors<ExhibitionFormData>(error));
      } else {
        setSubmitStatus("error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof ExhibitionFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string, endTimeString?: string) => {
    const [hours, minutes] = timeString.split(":");
    const startTime = `${hours}.${minutes.padStart(2, '0')}`;
    
    if (endTimeString) {
      const [endHours, endMinutes] = endTimeString.split(":");
      const endTime = `${endHours}.${endMinutes.padStart(2, '0')}`;
      return `${startTime} - ${endTime}`;
    }
    
    return startTime;
  };

  return (
    <section className={`w-full flex items-center pt-28 xl:pt-35 ${isLight ? 'bg-white' : 'bg-black'}`}>
      <div className="w-full flex flex-col xl:flex-row xl:items-center">
        <div className="w-full xl:w-[45%] h-auto xl:h-[65vh] xl:px-16 xl:ml-10 flex items-center">
          <div className="p-8 xl:p-12 w-full flex flex-col justify-center">
            <h2 className={`font-caudex text-center text-4xl font-bold mb-8 ${isLight ? 'text-black' : 'text-white text-shadow-lg/30'}`}>{exhibition.title}</h2>
            
            {(exhibition.date || exhibition.time) && (
              <div className="md:flex justify-evenly mb-8 text-center">
                {exhibition.date && (
                  <p className={`font-caudex text-xl mb-2 md:mb-0 ${isLight ? 'text-black' : 'text-white text-shadow-lg/30'}`}>
                    <strong>Date:</strong> {formatDate(exhibition.date)}
                  </p>
                )}
                {exhibition.time && (
                  <p className={`font-caudex text-xl ${isLight ? 'text-black' : 'text-white text-shadow-lg/30'}`}>
                    <strong>Time:</strong> {formatTime(exhibition.time, exhibition.endTime)}
                  </p>
                )}
              </div>
            )}

            <div className={`font-caudex text-base md:text-xl text-center leading-relaxed mb-6 whitespace-pre-line ${isLight ? 'text-black' : 'text-white text-shadow-lg/30'}`}>
              <ReactMarkdown>{exhibition.description}</ReactMarkdown>
            </div>

            {exhibition.location && (
              <div className="mb-8 text-center">
                <p className={`font-caudex text-xl ${isLight ? 'text-black' : 'text-white text-shadow-lg/30'}`}>
                  <strong>Location:</strong> {exhibition.location}
                </p>
              </div>
            )}

            <button
              onClick={() => setShowForm(true)}
              className={`font-caudex px-20 py-2 rounded-lg text-xl font-bold border hover:scale-110 shadow-sm self-center transition-all duration-300 ease-in-out ${
                isLight
                  ? 'bg-black text-white border-black hover:bg-white hover:text-black hover:border-white shadow-black'
                  : 'bg-black text-white border-white hover:bg-white hover:text-black hover:border-black shadow-white'
              } ${
                showForm 
                  ? 'invisible pointer-events-none' 
                  : 'visible'
              }`}
            >
              Book
            </button>
          </div>
        </div>

        <div className="w-[95%] xl:w-[45%] h-[65vh] ml-auto xl:ml-auto mt-8 mb-12 xl:mt-0 pb-8 xl:pb-0">
          {!showForm && exhibition.image ? (
            <div className="relative w-full h-full rounded-tl-[8rem] rounded-bl-[8rem] overflow-hidden">
              <StrapiImage
                src={exhibition.image.url}
                alt={exhibition.image.alternativeText || exhibition.title}
                fill
                className="object-cover"
              />
              {submitStatus === "success" && (
                <div className="absolute top-0 left-10 md:left-0 right-0 p-6 text-center">
                  <p className={`font-caudex text-2xl lg:text-3xl ${isLight ? 'text-black' : 'text-white text-shadow-lg/30'}`}>
                    Thank you! Your booking has been registered.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="relative rounded-tl-[8rem] rounded-bl-[8rem] p-12 h-full flex flex-col justify-center overflow-hidden">
      
              {exhibition.image && (
                <>
                  <div className="absolute inset-0 z-0">
                    <StrapiImage
                      src={exhibition.image.url}
                      alt={exhibition.image.alternativeText || exhibition.title}
                      fill
                      className="object-cover opacity-30"
                    />
                  </div>
                 
                  <div className="absolute inset-0 bg-black/40 z-0"></div>
                </>
              )}
              
              {/* Form content */}
              <form onSubmit={handleSubmit} noValidate className="space-y-6 relative z-10">
                  {submitStatus === "success" && (
                    <div className="px-4 py-3 rounded-lg text-xl lg:text-3xl font-caudex">
                      Thank you! Your booking has been registered.
                    </div>
                  )}
                {submitStatus === "error" && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    Something went wrong. Please try again.
                  </div>
                )}
                <div className="max-w-fit mx-auto">
                  <p className={`font-caudex text-center text-2xl lg:text-3xl mb-6 md:mb-20 -mt-4 ${isLight ? 'text-black' : 'text-white text-shadow-lg/30'}`}>
                    Please fill in your information for the booking.
                  </p>
                  <div>
                    <label htmlFor="name" className={`block font-caudex text-xl sm:text-2xl mb-2 ${isLight ? 'text-black' : 'text-white text-shadow-lg/30'}`}>
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
                      className="shadow-sm shadow-black "
                    />
                  </div>
                  <div className="mt-4 sm:mt-8">
                    <label htmlFor="email" className={`block font-caudex text-xl sm:text-2xl mb-2 ${isLight ? 'text-black' : 'text-white text-shadow-lg/30'}`}>
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
                  <div className="flex gap-4 justify-end mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-white font-caudex text-black px-8 py-2 rounded-lg text-xl font-bold border border-black hover:bg-black hover:text-white hover:scale-110 transition-all duration-300 ease-in-out shadow-sm shadow-black disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Book"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ name: "", email: "" });
                      setSubmitStatus(null);
                      setErrors({});
                    }}
                    disabled={isSubmitting}
                    className="bg-white font-caudex text-black px-8 py-2 rounded-lg text-xl font-bold border border-black hover:bg-black hover:text-white hover:scale-110 transition-all duration-300 ease-in-out shadow-sm shadow-black disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

