import { NextRequest, NextResponse } from 'next/server';
import { API_URL, AUTH_TOKEN } from '@/config/apiUrl';

export async function GET(
  _: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  if (!API_URL || !AUTH_TOKEN) {
    return NextResponse.json(
      { error: 'Strapi API configuration is missing.' },
      { status: 500 }
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
        { status: response.status }
      );
    }

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: 'Unable to reach Strapi startup detail endpoint.' },
      { status: 500 }
    );
  }
}
