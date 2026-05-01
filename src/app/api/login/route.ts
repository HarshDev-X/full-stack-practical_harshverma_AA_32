import { NextResponse } from 'next/server';

const ADMIN_CREDENTIALS = {
  email: 'admin@gmail.com',
  password: '1234'
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "All fields required", time: new Date().toISOString() },
        { status: 400 }
      );
    }

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      return NextResponse.json({
        message: "Login Success",
        time: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { message: "Invalid Credentials", time: new Date().toISOString() },
      { status: 401 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Invalid request format", time: new Date().toISOString() },
      { status: 400 }
    );
  }
}
