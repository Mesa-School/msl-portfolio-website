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
  console.log("API Endpoint:", endpoint);

  const token = process.env.API_BEARER_TOKEN;

  try {
    const response = await fetch(endpoint, {
      cache: 'no-store',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    const payload = await response.json();
    // console.log("Data fetched from API:", payload);

    if (!response.ok) {
      return NextResponse.json(
        { error: payload?.error ?? 'Failed to fetch startup.' },
        { status: response.status },
      );
    };

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: 'Unable to reach startup endpoint.' },
      { status: 500 },
    );
  }
}
