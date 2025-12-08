"use client";
import { useState, FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import { StrapiImage } from "../StrapiImage";
import type { ExhibitionBlockProps } from "@/types";

export function ExhibitionBlock({
  exhibition,
}: Readonly<ExhibitionBlockProps>) {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | "warning" | null>(null);
  const [formData, setFormData] = useState({ name: "", email: ""});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          exhibitionId: exhibition.documentId || exhibition.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `Failed to submit booking: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.emailSent === false) {
        setSubmitStatus("warning");
      } else {
        setSubmitStatus("success");
      }
      
      setFormData({ name: "", email: "" });

      setTimeout(() => {
        setShowForm(false);
        setSubmitStatus(null);
      }, 3000);
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("sv-SE", {
      month: "long",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
    return date.toLocaleTimeString("sv-SE");
  };

  return (
    <section className="w-full bg-black flex items-center pt-30">
      <div className="w-full flex">
        <div className="w-[35%]">
          <div className="bg-white rounded-tr-[8rem] rounded-br-[8rem] p-12 h-[75vh] flex flex-col justify-center">
            <h2 className="text-black text-center text-4xl font-bold mb-8">{exhibition.title}</h2>
            
            <div className="text-black text-base md:text-3xl text-center leading-relaxed mb-6 whitespace-pre-line">
              <ReactMarkdown>{exhibition.description}</ReactMarkdown>
            </div>

            <div className="space-y-3 mb-8 text-center">
              {exhibition.date && (
                <p className="text-black text-xl">
                  <strong>Date:</strong> {formatDate(exhibition.date)}
                </p>
              )}
              {exhibition.time && (
                <p className="text-black text-xl">
                  <strong>Time:</strong> {formatTime(exhibition.time)}
                </p>
              )}
              {exhibition.location && (
                <p className="text-black text-xl">
                  <strong>Location:</strong> {exhibition.location}
                </p>
              )}
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="bg-black text-white px-8 py-2 rounded-lg text-xl font-bold hover:bg-gray-800 transition-colors self-center"
            >
              Book
            </button>
          </div>
        </div>

        <div className="w-[60%] h-[75vh] ml-auto">
          {!showForm && exhibition.image ? (
            <div className="relative w-full h-full rounded-tl-[8rem] rounded-bl-[8rem] overflow-hidden">
              <StrapiImage
                src={exhibition.image.url}
                alt={exhibition.image.alternativeText || exhibition.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="bg-white rounded-tl-[8rem] rounded-bl-[8rem] p-12 h-full flex flex-col justify-center">
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitStatus === "success" && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                    Thank you! Your booking has been registered.
                  </div>
                )}
                {submitStatus === "warning" && (
                  <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
                    Your booking has been registered, but we couldn&apos;t send a confirmation email. Please contact us directly.
                  </div>
                )}
                {submitStatus === "error" && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    Something went wrong. Please try again.
                  </div>
                )}
                <div>
                  <label htmlFor="name" className="block text-black text-lg mb-2">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black disabled:opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-black text-lg mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black disabled:opacity-50"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-black text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Book"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ name: "", email: "" });
                      setSubmitStatus(null);
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
      </div>
    </section>
  );
}

