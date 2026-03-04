'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const inquiryTypes = [
  'General Inquiry',
  'Parent/Guardian',
  'Athlete',
  'Sponsor',
  'Merch/Orders',
];

function ContactForm() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: typeParam === 'sponsor' ? 'Sponsor' : 'General Inquiry',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeParam === 'sponsor') {
      setFormData((prev) => ({ ...prev, inquiryType: 'Sponsor' }));
    }
  }, [typeParam]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      errs.email = 'Enter a valid email';
    if (!formData.message.trim()) errs.message = 'Message is required';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    // TODO: Wire to email API or form service
    console.log('Form submitted:', formData);
    setErrors({});
    setSubmitted(true);
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent transition-colors ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-300'
    }`;

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent text-3xl">
          ✓
        </div>
        <p className="font-bold text-gray-900 text-xl">Message Sent!</p>
        <p className="text-gray-500 text-sm">
          We&apos;ll get back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div>
        <input
          id="contact-name"
          type="text"
          placeholder="Your Name *"
          aria-label="Your name"
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={inputClass('name')}
        />
        {errors.name && (
          <p id="contact-name-error" className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>
      <div>
        <input
          id="contact-email"
          type="email"
          placeholder="Your Email *"
          aria-label="Your email address"
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={inputClass('email')}
        />
        {errors.email && (
          <p id="contact-email-error" className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>
      <select
        id="contact-inquiry"
        aria-label="Inquiry type"
        value={formData.inquiryType}
        onChange={(e) =>
          setFormData({ ...formData, inquiryType: e.target.value })
        }
        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
      >
        {inquiryTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <div>
        <textarea
          id="contact-message"
          placeholder="Your Message *"
          aria-label="Your message"
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          rows={5}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className={`${inputClass('message')} resize-none`}
        />
        {errors.message && (
          <p id="contact-message-error" className="text-red-500 text-xs mt-1">{errors.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full py-4 bg-brand-deep text-white font-semibold uppercase tracking-wide text-sm hover:bg-brand-accent transition-colors rounded-lg"
      >
        Send Message
      </button>
    </form>
  );
}

const contactItems = [
  {
    emoji: '✉',
    label: 'Email',
    // TODO: Replace with real contact info from env vars
    value: 'info@jazbabasketball.com',
    href: 'mailto:info@jazbabasketball.com',
  },
  {
    emoji: '📞',
    label: 'Phone',
    // TODO: Replace with real contact info from env vars
    value: '+1 (647) 555-0123',
    href: 'tel:+16475550123',
  },
  {
    emoji: '📸',
    label: 'Instagram',
    // TODO: Replace with real contact info from env vars
    value: '@jazbabasketball',
    href: 'https://instagram.com/jazbabasketball',
    external: true,
  },
  {
    emoji: '💬',
    label: 'WhatsApp',
    // TODO: Replace with real contact info from env vars
    value: 'Message us',
    href: 'https://wa.me/1234567890',
    external: true,
  },
];

export default function Contact() {
  return (
    <section id="contact" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 uppercase mb-12">
          Get In Touch
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left: Form */}
          <Suspense
            fallback={
              <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
            }
          >
            <ContactForm />
          </Suspense>

          {/* Right: Contact Info */}
          <div className="flex flex-col gap-6 md:pt-2">
            {contactItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl group-hover:bg-brand-accent transition-colors flex-shrink-0">
                  {item.emoji}
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    {item.label}
                  </p>
                  <p className="font-semibold text-gray-900 group-hover:text-brand-accent transition-colors">
                    {item.value}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
