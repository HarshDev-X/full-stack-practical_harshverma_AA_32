import { NextResponse } from 'next/server';
import { getUsers, addUser, findUserByEmail } from '@/lib/mock-db';

export async function GET() {
  return NextResponse.json({
    message: "Operation successful",
    data: getUsers(),
    time: new Date().toISOString()
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { message: "All fields (name, email) are required", time: new Date().toISOString() },
        { status: 400 }
      );
    }

    if (findUserByEmail(email)) {
      return NextResponse.json(
        { message: "Duplicate email detected", time: new Date().toISOString() },
        { status: 400 }
      );
    }

    const newUser = addUser({ name, email });
    return NextResponse.json({
      message: "User created successfully",
      data: newUser,
      time: new Date().toISOString()
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { message: "Invalid request format", time: new Date().toISOString() },
      { status: 400 }
    );
  }
}
