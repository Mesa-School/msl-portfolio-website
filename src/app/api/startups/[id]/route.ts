import { NextRequest, NextResponse } from 'next/server';

import { API_URL } from '@/config/apiUrl';
import { toProxyUrl } from '@/lib/imageProxy';

/** Rewrite all image URL fields inside a single startup detail payload. */
function proxyStartupDetailImages(payload: any): any {
  const data = payload?.data;
  if (!data) return payload;

  return {
    ...payload,
    data: {
      ...data,
      company_logo: toProxyUrl(data.company_logo) ?? data.company_logo,
      company_header_image: toProxyUrl(data.company_header_image) ?? data.company_header_image,
      founder: Array.isArray(data.founder)
        ? data.founder.map((f: any) => ({
            ...f,
            founder_profile_pic: toProxyUrl(f.founder_profile_pic) ?? f.founder_profile_pic,
          }))
        : data.founder,
      competitors: Array.isArray(data.competitors)
        ? data.competitors.map((c: any) => ({
            ...c,
            competitor_image: toProxyUrl(c.competitor_image) ?? c.competitor_image,
          }))
        : data.competitors,
      key_achievements: Array.isArray(data.key_achievements)
        ? data.key_achievements.map((a: any) => ({
            ...a,
            achievement_image: toProxyUrl(a.achievement_image) ?? a.achievement_image,
          }))
        : data.key_achievements,
    },
  };
}

export async function GET(
  _request: NextRequest,
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
        { error: payload?.error ?? 'Failed to fetch startup.' },
        { status: response.status },
      );
    }

    return NextResponse.json(proxyStartupDetailImages(payload));
  } catch (error) {
    return NextResponse.json(
      { error: 'Unable to reach startup endpoint.' },
      { status: 500 },
    );
  }
}
