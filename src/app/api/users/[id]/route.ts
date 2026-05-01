import { NextResponse } from 'next/server';
import { getUserById, deleteUser } from '@/lib/mock-db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = getUserById(id);
  
  if (!user) {
    return NextResponse.json(
      { message: "User not found", time: new Date().toISOString() },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Operation successful",
    data: user,
    time: new Date().toISOString()
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = deleteUser(id);

  if (!deleted) {
    return NextResponse.json(
      { message: "User not found", time: new Date().toISOString() },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "User deleted successfully",
    time: new Date().toISOString()
  });
}
