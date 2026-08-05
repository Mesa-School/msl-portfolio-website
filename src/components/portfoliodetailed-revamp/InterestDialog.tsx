'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { interestFormSchema, type InterestFormValues } from '@/lib/interestForm';
import { poppins } from './fonts';
import type { Brand } from './types';

const FIELD_CLASS =
  'w-full rounded-xl border border-white/12 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-white/30 focus:bg-white/[0.07]';

// No font-* class here — the labels inherit Poppins from DialogContent.
const LABEL_CLASS =
  'text-[10px] font-medium tracking-[0.18em] uppercase text-white/45';

type InterestDialogProps = {
  startupName: string;
  startupSlug: string;
  brand: Brand;
};

export const InterestDialog = ({
  startupName,
  startupSlug,
  brand,
}: InterestDialogProps) => {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InterestFormValues>({
    resolver: zodResolver(interestFormSchema),
    defaultValues: { name: '', email: '', linkedinUrl: '', message: '' },
  });

  /** Clear the form a beat after the dialog closes, so it doesn't flicker mid-fade. */
  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      window.setTimeout(() => {
        reset();
        setSubmitted(false);
        setSubmitError(null);
      }, 200);
    }
  };

  const onSubmit = async (values: InterestFormValues) => {
    setSubmitError(null);

    try {
      const res = await fetch('/api/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, startupName, startupSlug }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        setSubmitError(payload?.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError('Could not reach the server. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.4, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 14,
            delay: 0.9,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.55)] backdrop-blur-md sm:bottom-7 sm:right-7 sm:px-5"
          style={{ background: brand.primary, color: brand.ink }}
        >
          {/* Halo that pings outward a few times to pull the eye, then settles.
              Must sit outside any overflow-hidden ancestor or it gets clipped
              at the button edge and never actually reads as a ping. */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{ border: `2px solid ${brand.ink}` }}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: [0, 0.6, 0], scale: [1, 1.5] }}
            transition={{
              duration: 1.6,
              delay: 1.5,
              repeat: 3,
              repeatDelay: 0.7,
              ease: 'easeOut',
            }}
          />

          {/* Sheen sweep. Clipped by its own wrapper so the halo above stays free. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
          >
            <motion.span
              className="absolute inset-y-0 w-1/3 -skew-x-12"
              style={{
                background: `linear-gradient(90deg, transparent, ${brand.ink}59, transparent)`,
              }}
              initial={{ left: '-40%' }}
              animate={{ left: ['-40%', '140%'] }}
              transition={{
                duration: 1.1,
                delay: 1.8,
                repeat: 2,
                repeatDelay: 2.4,
                ease: 'easeInOut',
              }}
            />
          </span>

          <Sparkles className="relative z-10 h-3.5 w-3.5" />
          <span className="relative z-10 font-bold text-[10px] sm:text-[11px] tracking-[0.16em] uppercase whitespace-nowrap">
            I&rsquo;m interested
          </span>
        </motion.button>
      </DialogTrigger>

      <DialogContent
        className={`${poppins.className} border-white/10 bg-msl-card text-white sm:max-w-md`}
      >
        {submitted ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: `${brand.primary}22`, color: brand.primary }}
            >
              <Check className="h-7 w-7" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">
                Thanks, we&rsquo;ve got it
              </DialogTitle>
              <DialogDescription className="mt-1.5 text-sm text-white/50">
                The {startupName} team will reach out to you shortly.
              </DialogDescription>
            </div>
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="mt-1 rounded-full bg-white px-6 py-2 text-sm font-semibold text-[#05070f] transition-transform hover:scale-[1.03]"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Interested in {startupName}?
              </DialogTitle>
              <DialogDescription className="text-sm text-white/50">
                Leave your details and the team will get in touch.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="interest-name" className={LABEL_CLASS}>
                  Name
                </label>
                <input
                  id="interest-name"
                  autoComplete="name"
                  placeholder="Your full name"
                  aria-invalid={Boolean(errors.name)}
                  className={FIELD_CLASS}
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-[11px] text-red-300/90">{errors.name.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="interest-email" className={LABEL_CLASS}>
                  Email
                </label>
                <input
                  id="interest-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  aria-invalid={Boolean(errors.email)}
                  className={FIELD_CLASS}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-[11px] text-red-300/90">{errors.email.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="interest-linkedin" className={LABEL_CLASS}>
                  LinkedIn
                </label>
                <input
                  id="interest-linkedin"
                  type="url"
                  inputMode="url"
                  placeholder="https://www.linkedin.com/in/your-name"
                  aria-invalid={Boolean(errors.linkedinUrl)}
                  className={FIELD_CLASS}
                  {...register('linkedinUrl')}
                />
                {errors.linkedinUrl && (
                  <p className="text-[11px] text-red-300/90">
                    {errors.linkedinUrl.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="interest-message" className={LABEL_CLASS}>
                  Message <span className="text-white/25">(optional)</span>
                </label>
                <textarea
                  id="interest-message"
                  rows={3}
                  placeholder="Anything you'd like them to know?"
                  aria-invalid={Boolean(errors.message)}
                  className={`${FIELD_CLASS} resize-none`}
                  {...register('message')}
                />
                {errors.message && (
                  <p className="text-[11px] text-red-300/90">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {submitError && (
                <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-[12px] text-red-200">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                style={{ background: brand.primary, color: brand.ink }}
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="size-4" />
                    Sending…
                  </>
                ) : (
                  'Send'
                )}
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
