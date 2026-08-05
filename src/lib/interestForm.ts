import { z } from 'zod';

/**
 * "I'm interested" enquiry raised from a startup's portfolio page.
 *
 * Shared by the dialog (client-side validation) and the API route (server-side
 * validation) so the two can never disagree about what a valid enquiry is.
 */
export const interestFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your full name.')
    .max(100, 'That name is too long.'),
  email: z
    .email('Enter a valid email address.')
    .max(200, 'That email is too long.'),
  linkedinUrl: z
    .url('Enter a full URL, e.g. https://www.linkedin.com/in/your-name')
    .max(300, 'That URL is too long.')
    .refine(
      (value) => value.toLowerCase().includes('linkedin.com'),
      'That does not look like a LinkedIn profile URL.',
    ),
  message: z
    .string()
    .trim()
    .max(1000, 'Please keep it under 1000 characters.')
    .optional(),
});

export type InterestFormValues = z.infer<typeof interestFormSchema>;

/** What the API route accepts: the form plus which startup it came from. */
export const interestSubmissionSchema = interestFormSchema.extend({
  startupSlug: z.string().trim().min(1, 'Missing startup slug.'),
  startupName: z.string().trim().min(1, 'Missing startup name.'),
});

export type InterestSubmission = z.infer<typeof interestSubmissionSchema>;
