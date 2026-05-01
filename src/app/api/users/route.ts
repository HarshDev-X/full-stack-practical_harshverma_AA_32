import { NextResponse } from 'next/server';

/**
 * documentation endpoint
 * Real data persistence is handled via Firestore in the Documentation Playground.
 */
export async function GET() {
  return NextResponse.json({
    message: "User Resource Node Active",
    status: "online",
    documentation: "Perform a GET request in the playground to see real Firestore records."
  });
}

export async function POST() {
  return NextResponse.json({
    message: "User Provisioning Endpoint Ready",
    documentation: "Test document creation directly via the Interactive Documentation cards."
  });
}