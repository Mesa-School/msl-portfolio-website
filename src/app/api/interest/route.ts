import { NextRequest, NextResponse } from 'next/server';

import { API_URL } from '@/config/apiUrl';
import { interestSubmissionSchema } from '@/lib/interestForm';

/**
 * Receives an "I'm interested" enquiry from a startup's portfolio page and
 * forwards it to the CRM, which stores it in the `startup_interests`
 * collection foreign-keyed to `startups_v2`.
 *
 * The CRM resolves the startup from `startup_slug` itself and rejects unknown
 * slugs, so the stored enquiry always points at a real startup.
 */
export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const parsed = interestSubmissionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed.',
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const submission = parsed.data;

  if (!API_URL) {
    return NextResponse.json(
      { success: false, error: 'API configuration is missing.' },
      { status: 500 },
    );
  }

  // The CRM schema is snake_case and uses `extra="forbid"`, so only the fields
  // it declares may be sent — `startupName` is deliberately not forwarded, the
  // CRM snapshots the name itself from the startup it resolves.
  const crmPayload = {
    startup_slug: submission.startupSlug,
    name: submission.name,
    email: submission.email,
    linkedin_url: submission.linkedinUrl,
    ...(submission.message ? { message: submission.message } : {}),
  };

  try {
    const res = await fetch(`${API_URL}/api/v2/startup-interests/`, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(crmPayload),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error(
        `[interest] CRM rejected enquiry for ${submission.startupSlug} (${res.status}): ${detail.slice(0, 500)}`,
      );

      // An unknown slug is our data problem, not the visitor's — don't leak a
      // 404 into the form, where it would read as "your details were wrong".
      return NextResponse.json(
        { success: false, error: 'Could not record your interest. Please try again.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      `[interest] Could not reach the CRM for ${submission.startupSlug}:`,
      error,
    );
    return NextResponse.json(
      { success: false, error: 'Could not record your interest. Please try again.' },
      { status: 502 },
    );
  }
}
