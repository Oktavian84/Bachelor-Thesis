"use client";
import { useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { StrapiImage } from "../StrapiImage";
import type { ContactBlockProps } from "@/types";

export function ContactBlock({
  headline,
  content,
  image,
  buttonText,
  cta,
}: Readonly<ContactBlockProps>) {
  const [showForm, setShowForm] = useState(false);

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
              <form className="space-y-6">
                <div>
                  <label className="block text-black text-lg mb-2">Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black"
                  />
                </div>
                <div>
                  <label className="block text-black text-lg mb-2">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black"
                  />
                </div>
                <div>
                  <label className="block text-black text-lg mb-2">Message</label>
                  <textarea
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-black text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-gray-800 transition-colors"
                  >
                    Send
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-300 text-black px-8 py-4 rounded-lg text-xl font-bold hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="w-[35%] ml-auto">
          <div className="bg-white rounded-tl-[8rem] rounded-bl-[8rem] p-12 h-[75vh] flex flex-col justify-center">
            <h2 className="text-black text-4xl font-bold mb-8">{headline}</h2>
            <div className="text-black text-base md:text-3xl text-center leading-relaxed mb-14 whitespace-pre-line">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
            {cta && cta.length > 0 && (
              <div className="flex gap-4 justify-center mb-12">
                {cta.map((link, index) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    target={link.isExternal ? "_blank" : "_self"}
                    className="w-12 h-12 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-colors"
                    aria-label={link.text || (index === 0 ? "Facebook" : "Instagram")}
                  >
                    {index === 0 ? (
                      <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    ) : index === 1 ? (
                      <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
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
              className="bg-black text-white px-8 py-2 rounded-lg text-xl font-bold hover:bg-gray-800 transition-colors self-center"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

