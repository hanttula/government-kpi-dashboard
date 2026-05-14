import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { db } from './db'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as NextAuthOptions['adapter'],
  session: { strategy: 'jwt' },

  pages: {
    signIn: '/auth/signin',
    newUser: '/dashboard',
  },

  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await db.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        })
        if (!user?.password) return null

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null

        return { id: user.id, email: user.email, name: user.name, image: user.image }
      },
    }),

    // Google and GitHub are only activated when env vars are set
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),

    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id
      return session
    },
  },
}

// Default KPIs pre-selected for a brand-new user
export const DEFAULT_PREFERENCES = [
  { branch: 'executive', kpiId: 'exec-001', position: 1 },
  { branch: 'executive', kpiId: 'exec-002', position: 2 },
  { branch: 'executive', kpiId: 'exec-003', position: 3 },
  { branch: 'legislative', kpiId: 'leg-001', position: 1 },
  { branch: 'legislative', kpiId: 'leg-002', position: 2 },
  { branch: 'legislative', kpiId: 'leg-004', position: 3 },
  { branch: 'judicial', kpiId: 'jud-001', position: 1 },
  { branch: 'judicial', kpiId: 'jud-002', position: 2 },
  { branch: 'judicial', kpiId: 'jud-003', position: 3 },
] as const
