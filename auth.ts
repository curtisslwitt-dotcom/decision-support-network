import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined
        if (!email || !password) return null

        const user = await prisma.adminUser.findUnique({ where: { email } })
        if (!user) return null

        const valid = await bcrypt.compare(password, user.passwordHash)
        if (!valid) return null

        return { id: user.id, email: user.email }
      },
    }),
  ],
  callbacks: {
    // Only allow Google sign-in for emails already provisioned as admins.
    async signIn({ account, profile }: any) {
      if (account?.provider === 'google') {
        const email = profile?.email as string | undefined
        if (!email || !profile?.email_verified) return false
        const admin = await prisma.adminUser.findUnique({ where: { email } })
        return !!admin
      }
      return true
    },
    async jwt({ token, user, account }: any) {
      if (user) {
        token.email = user.email
        // For Google sign-in, resolve the internal admin id from the DB.
        if (account?.provider === 'google') {
          const admin = await prisma.adminUser.findUnique({ where: { email: user.email } })
          if (admin) token.id = admin.id
        } else {
          token.id = user.id
        }
      }
      return token
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.id = token?.id as string
        session.user.email = token?.email as string
      }
      return session
    },
    async redirect({ url, baseUrl }: any) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      try {
        if (new URL(url).origin === baseUrl) return url
      } catch {}
      return `${baseUrl}/admin`
    },
  },
})
