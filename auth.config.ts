import type { NextAuthConfig } from 'next-auth';
import type { AdapterUser } from 'next-auth/adapters';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);
        
        if (!parsedCredentials.success) {
          return null;
        }
        
        const { email, password } = parsedCredentials.data;
        
        const user = await prisma.user.findUnique({
          where: { email },
        });
        
        if (!user) {
          return null;
        }
        
        const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
        
        if (!passwordsMatch) {
          return null;
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const adapterUser = user as AdapterUser & { role?: string };
        token.id = adapterUser.id;
        token.email = adapterUser.email;
        token.name = adapterUser.name;
        if (adapterUser.role) {
          token.role = adapterUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        const sessionUser = session.user as typeof session.user & { role?: string };
        sessionUser.id = token.id as string;
        sessionUser.email = token.email as string;
        sessionUser.name = token.name as string | null;
        sessionUser.role = (token.role as string | undefined) ?? 'USER';
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET,
};
