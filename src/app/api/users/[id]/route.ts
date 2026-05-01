import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: "Point-Query Interface Ready",
    documentation: "Requires a valid Firebase UID in the playground parameter field."
  });
}

export async function DELETE() {
  return NextResponse.json({
    message: "Purge Interface Ready",
    warning: "Deletions in the playground are irrevocable in the real Firestore database."
  });
}