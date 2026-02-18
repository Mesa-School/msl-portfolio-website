import { NextRequest, NextResponse } from 'next/server';

// Only proxy images that originate from these trusted hosts
const ALLOWED_HOSTS = ['storage.googleapis.com', 'res.cloudinary.com'];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const encoded = searchParams.get('url');

  if (!encoded) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  let imageUrl: string;
  try {
    imageUrl = Buffer.from(encoded, 'base64url').toString('utf-8');
  } catch {
    return new NextResponse('Invalid url parameter', { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    return new NextResponse('Invalid image URL', { status: 400 });
  }

  if (!ALLOWED_HOSTS.includes(parsedUrl.hostname)) {
    return new NextResponse('Host not allowed', { status: 403 });
  }

  try {
    const upstream = await fetch(imageUrl, {
      // Cache the upstream response for 24 h on the server
      next: { revalidate: 86400 },
    });

    if (!upstream.ok) {
      return new NextResponse('Failed to fetch image', { status: upstream.status });
    }

    const contentType = upstream.headers.get('content-type') ?? 'image/jpeg';

    return new NextResponse(upstream.body, {
      headers: {
        'Content-Type': contentType,
        // Tell the browser to cache for 24 h, serve stale for 1 h while revalidating
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
      },
    });
  } catch {
    return new NextResponse('Failed to fetch image', { status: 500 });
  }
}
