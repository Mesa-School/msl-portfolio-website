import { NextRequest, NextResponse } from 'next/server';

import { API_URL, AUTH_TOKEN } from '@/config/apiUrl';

export async function GET(request: NextRequest) {
  if (!API_URL || !AUTH_TOKEN) {
    return NextResponse.json(
      { error: 'Strapi API configuration is missing.' },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const defaultParams = new URLSearchParams();

  defaultParams.set(
    'fields',
    'startup_name,startup_summary,location,cohort',
  );
  defaultParams.set('populate[founder][fields]', 'name,designation');
  defaultParams.set('populate[company_logo][fields]', 'url');
  defaultParams.set('populate[sector][fields]', 'name');

  defaultParams.forEach((value, key) => {
    if (!searchParams.has(key)) {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  const endpoint = `${API_URL}/startup2${query ? `?${query}` : ''}`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      cache: 'no-store',
    });

    const payload = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: payload?.error ?? 'Failed to fetch startups.' },
        { status: response.status },
      );
    }

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: 'Unable to reach Strapi startups endpoint.' },
      { status: 500 },
    );
  }
}

