import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nama, email, dan password wajib diisi' },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findFirst({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar. Silakan login.' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'USER',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { error: 'Gagal mendaftar. Coba lagi nanti.' },
      { status: 500 }
    );
  }
}
