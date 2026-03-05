import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';

export async function POST(req: Request) {
    try {
        const { EmailAddress, Password } = await req.json();

        if (!EmailAddress || !Password) {
            return NextResponse.json({ message: 'Email and Password are required' }, { status: 400 });
        }

        const user = await prisma.mOMStaff.findUnique({
            where: { EmailAddress }
        });

        if (!user || !user.Password) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const isValidPassword = await bcrypt.compare(Password, user.Password);

        if (!isValidPassword) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-development');
        const token = await new jose.SignJWT({ id: user.StaffID, role: user.Role, name: user.StaffName })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(secret);

        const response = NextResponse.json({
            message: 'Login successful',
            user: {
                id: user.StaffID,
                name: user.StaffName,
                email: user.EmailAddress,
                role: user.Role
            }
        });

        response.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 1 day
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
