import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  // Logic to log every request
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Request received: ${request.method} ${request.nextUrl.pathname}`);
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
