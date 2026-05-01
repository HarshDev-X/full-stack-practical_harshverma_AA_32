import { NextResponse } from 'next/server';

/**
 * documentation endpoint
 * In this prototype, the real login logic happens in the client-side playground
 * to utilize direct Firebase Authentication hooks.
 */
export async function POST(request: Request) {
  return NextResponse.json({
    message: "Admin Auth Ready",
    documentation: "Use the interactive playground to test real Firebase Authentication.",
    server_time: new Date().toISOString()
  });
}