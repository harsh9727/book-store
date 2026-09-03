"use client";

import { FormEvent, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Globe2, Send } from "lucide-react";

const ContactForm = () => {
  const form = useRef<HTMLFormElement>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const sendEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.current) return;

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        form.current,
        {
          publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
        },
      );

      setSuccess("Your message has been sent successfully!");

      form.current.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);

      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 rounded-lg bg-orange-50 p-6 lg:grid-cols-2">
          {/* ================= LEFT: CONTACT FORM ================= */}

          <div className="rounded-2xl border border-gray-300 bg-white p-6 sm:p-6 lg:p-8">
            <h2 className="title text-3xl text-gray-900 sm:text-4xl">
              Send us a Message
            </h2>

            <p className="mt-3 description leading-6 text-gray-600">
              Have a question or need assistance? Fill out the form below, and
              our team will respond as quickly as possible.
            </p>

            <form ref={form} onSubmit={sendEmail} className="mt-6 space-y-5">
              {/* Name + Phone */}
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Name */}
                <input
                  type="text"
                  name="user_name"
                  placeholder="Enter your name"
                  required
                  className="h-13 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none transition focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
                />

                {/* Phone */}
                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-2 text-gray-600">
                    <Globe2 size={19} />
                    <span>+91</span>
                  </div>

                  <input
                    type="tel"
                    name="user_phone"
                    placeholder="Enter your phone number"
                    required
                    className="h-13 w-full rounded-xl border border-gray-300 pl-24 pr-4 text-sm outline-none transition focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
                  />
                </div>
              </div>

              {/* Email */}
              <input
                type="email"
                name="user_email"
                placeholder="Enter your email"
                required
                className="h-13 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none transition focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
              />

              {/* Message */}
              <textarea
                name="message"
                placeholder="Your Message"
                required
                rows={5}
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-4 text-sm outline-none transition focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
              />

              {/* Success Message */}
              {success && (
                <div className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                  {success}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-orange-600 text-base font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ================= RIGHT: GOOGLE MAP ================= */}
          <div className="h-full overflow-hidden rounded-2xl border border-gray-300 bg-white p-5">
            <iframe
              src="https://www.google.com/maps?q=Sahitya%20Seva%20Sadan,%20Shahid%20Veer%20Kinariwala%20Marg,%20Ellisbridge,%20Ahmedabad,%20Gujarat%20380006&output=embed"
              width="100%"
              height="100%"
              style={{
                border: 0,
                minHeight: "450px",
              }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="GTBS Store Location"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
