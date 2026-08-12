import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

const configured = Boolean(process.env.AUTH_MICROSOFT_ENTRA_ID_ID && process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET && process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: configured ? [MicrosoftEntraID({
    clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
    clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
    issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER!,
  })] : [],
  session: { strategy: "jwt" },
  pages: { signIn: "/" },
  callbacks: {
    authorized: async ({ auth: session }) => configured ? Boolean(session?.user?.email) : true,
  },
});
