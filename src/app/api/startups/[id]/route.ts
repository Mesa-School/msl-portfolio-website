import { NextRequest, NextResponse } from 'next/server';

import { API_URL, AUTH_TOKEN } from '@/config/apiUrl';

type RouteContext = {
  params: { id: string };
};

export async function GET(_: NextRequest, context: RouteContext) {
  if (!API_URL || !AUTH_TOKEN) {
    return NextResponse.json(
      { error: 'Strapi API configuration is missing.' },
      { status: 500 },
    );
  }

  const { id } = context.params;

  if (!id) {
    return NextResponse.json(
      { error: 'Startup identifier is required.' },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${API_URL}/startup2/${id}?populate=*`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      cache: 'no-store',
    });

    const payload = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: payload?.error ?? 'Failed to fetch startup details.' },
        { status: response.status },
      );
    }

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: 'Unable to reach Strapi startup detail endpoint.' },
      { status: 500 },
    );
  }
}

