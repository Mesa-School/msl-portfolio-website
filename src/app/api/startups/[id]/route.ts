import { NextRequest, NextResponse } from 'next/server';

import { API_URL } from '@/config/apiUrl';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!API_URL) {
    return NextResponse.json(
      { error: 'API configuration is missing.' },
      { status: 500 },
    );
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: 'Startup ID is required.' },
      { status: 400 },
    );
  }

  const endpoint = `${API_URL}/api/startups/${id}`;

  try {
    const response = await fetch(endpoint, {
      cache: 'no-store',
    });

    const payload = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: payload?.error ?? 'Failed to fetch startup.' },
        { status: response.status },
      );
    }

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: 'Unable to reach startup endpoint.' },
      { status: 500 },
    );
  }
}
