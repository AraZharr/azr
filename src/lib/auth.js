import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'

/** NextAuth configuration — plain object, no NextAuth() call */
export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email
        const password = credentials?.password

        if (!email || !password) {
          console.error('[auth] missing credentials')
          return null
        }

        let user
        try {
          user = await prisma.user.findUnique({ where: { email } })
        } catch (err) {
          console.error('[auth] database error:', err?.message || err)
          return null
        }

        if (!user) {
          console.error('[auth] user not found:', email)
          return null
        }

        if (password !== user.password) {
          console.error('[auth] password mismatch for:', email)
          return null
        }

        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/admin/login' },
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
