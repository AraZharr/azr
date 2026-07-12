import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const authOptions = {
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

        if (!email || !password) return null

        try {
          const user = await prisma.user.findUnique({ where: { email } })
          if (!user) return null

          const isValid = await bcrypt.compare(password, user.password)
          if (!isValid) return null

          return { id: user.id, email: user.email, name: user.name }
        } catch {
          return null
        }
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

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
