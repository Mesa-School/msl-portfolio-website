import { describe, it, expect } from 'vitest';

import { interestFormSchema, interestSubmissionSchema } from './interestForm';

const valid = {
  name: 'Asha Menon',
  email: 'asha@example.com',
  linkedinUrl: 'https://www.linkedin.com/in/asha-menon',
  message: 'Would love to chat.',
};

const fieldError = (result: { success: boolean; error?: unknown }, key: string) =>
  (result as { error: { flatten: () => { fieldErrors: Record<string, string[]> } } })
    .error.flatten().fieldErrors[key];

describe('interestFormSchema', () => {
  it('accepts a complete enquiry', () => {
    expect(interestFormSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts an enquiry without a message, since it is optional', () => {
    const { message, ...withoutMessage } = valid;
    expect(interestFormSchema.safeParse(withoutMessage).success).toBe(true);
  });

  it('trims surrounding whitespace from the name', () => {
    const parsed = interestFormSchema.parse({ ...valid, name: '  Asha Menon  ' });
    expect(parsed.name).toBe('Asha Menon');
  });

  it('rejects a one-character name', () => {
    const result = interestFormSchema.safeParse({ ...valid, name: 'A' });
    expect(result.success).toBe(false);
    expect(fieldError(result, 'name')).toBeDefined();
  });

  it('rejects a malformed email', () => {
    const result = interestFormSchema.safeParse({ ...valid, email: 'asha@' });
    expect(result.success).toBe(false);
    expect(fieldError(result, 'email')).toBeDefined();
  });

  it('rejects a non-LinkedIn URL', () => {
    const result = interestFormSchema.safeParse({
      ...valid,
      linkedinUrl: 'https://twitter.com/asha',
    });
    expect(result.success).toBe(false);
    expect(fieldError(result, 'linkedinUrl')).toBeDefined();
  });

  it('rejects a LinkedIn handle that is not a full URL', () => {
    const result = interestFormSchema.safeParse({
      ...valid,
      linkedinUrl: 'linkedin.com/in/asha',
    });
    expect(result.success).toBe(false);
  });

  it('accepts a country-subdomain LinkedIn URL', () => {
    const result = interestFormSchema.safeParse({
      ...valid,
      linkedinUrl: 'https://in.linkedin.com/in/asha-menon',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a message over 1000 characters', () => {
    const result = interestFormSchema.safeParse({
      ...valid,
      message: 'x'.repeat(1001),
    });
    expect(result.success).toBe(false);
  });
});

describe('interestSubmissionSchema', () => {
  it('requires the startup the enquiry came from', () => {
    expect(interestSubmissionSchema.safeParse(valid).success).toBe(false);
  });

  it('accepts the form plus startup identifiers', () => {
    const result = interestSubmissionSchema.safeParse({
      ...valid,
      startupSlug: 'fyn',
      startupName: 'FYN Wellness',
    });
    expect(result.success).toBe(true);
  });
});
