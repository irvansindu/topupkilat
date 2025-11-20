import { NextRequest, NextResponse } from 'next/server';

// Bridge /api/auth/error -> /auth/error so tidak 404
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const search = url.search;
  return NextResponse.redirect(new URL(`/auth/error${search}`, url.origin));
}
