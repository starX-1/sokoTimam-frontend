// /app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const { data } = await api.post("/user/login", {
                        email: credentials.email,
                        password: credentials.password,
                    });
                    const { token, user } = data;
                    if (token && user) return { ...user, accessToken: token };
                    return null;
                } catch (err) {
                    console.error("Credentials login error:", err.response?.data || err.message);
                    return null;
                }
            },
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],

    pages: { signIn: "/login" },
    session: { strategy: "jwt" },

    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                try {
                    const randomPassword = Math.random().toString(36).slice(-12);
                    const payload = {
                        email: profile.email,
                        // name: profile.name,
                        // split profile.name into firstname and lastname
                        firstname: profile.name.split(" ")[0],
                        lastname: profile.name.split(" ")[1],
                        googleId: profile.sub,
                        isGoogleUser: true,
                        // password: randomPassword,
                    };
                    console.log("Google signup payload:", payload);
                    const res = await api.post("/user", payload);
                    const { token: backendToken, user: backendUser } = res.data;
                    user.accessToken = backendToken;
                    user.id = backendUser.id;
                    return true;
                } catch (err) {
                    console.error("Google signin error details:", {
                        status: err.response?.status,
                        data: err.response?.data,
                        message: err.message,
                    });
                    const status = err.response?.status;
                    if (status === 409) {
                        return `${process.env.NEXTAUTH_URL}/login?error=EMAIL_EXISTS`;
                    }
                    return `${process.env.NEXTAUTH_URL}/login?error=GOOGLE_SIGNIN_FAILED`;
                }
            }
            return true;
        },

        async jwt({ token, user, account }) {
            if (user) {
                token.user = {
                    id: user.id ?? user.sub ?? user.id,
                    name: user.name,
                    email: user.email,
                };
                token.accessToken = user.accessToken ?? token.accessToken;
            }
            if (account?.access_token) token.providerAccessToken = account.access_token;
            return token;
        },

        async session({ session, token }) {
            session.user = token.user ?? session.user;
            session.accessToken = token.accessToken;
            session.providerAccessToken = token.providerAccessToken;
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };