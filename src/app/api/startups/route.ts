import { NextRequest, NextResponse } from 'next/server';

import { API_URL } from '@/config/apiUrl';
import { toProxyUrl } from '@/lib/imageProxy';

/** Rewrite all image URL fields inside the startup list payload. */
function proxyStartupImages(payload: any): any {
  if (!payload?.data || !Array.isArray(payload.data)) return payload;

  return {
    ...payload,
    data: payload.data.map((item: any) => {
      // company_logo may be a plain string URL or an object with a `url` key
      if (typeof item.company_logo === 'string') {
        return { ...item, company_logo: toProxyUrl(item.company_logo) };
      }
      if (item.company_logo?.url) {
        return {
          ...item,
          company_logo: { ...item.company_logo, url: toProxyUrl(item.company_logo.url) },
        };
      }
      return item;
    }),
  };
}

export async function GET(request: NextRequest) {
  if (!API_URL) {
    return NextResponse.json(
      { error: 'API configuration is missing.' },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);

  // Set default parameters
  if (!searchParams.has('limit')) {
    searchParams.set('limit', '10');
  }
  if (!searchParams.has('page')) {
    searchParams.set('page', '1');
  }

  // Add published filter by default unless explicitly overridden
  if (!searchParams.has('published')) {
    searchParams.set('published', 'true');
  }

  const query = searchParams.toString();
  const endpoint = `${API_URL}/api/startups/${query ? `?${query}` : ''}`;

  const token = process.env.API_BEARER_TOKEN;

  try {
    const response = await fetch(endpoint, {
      cache: 'no-store',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    const payload = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: payload?.error ?? 'Failed to fetch startups.' },
        { status: response.status },
      );
    }

    return NextResponse.json(proxyStartupImages(payload));
  } catch (error) {
    return NextResponse.json(
      { error: 'Unable to reach startups endpoint.' },
      { status: 500 },
    );
  }
}
