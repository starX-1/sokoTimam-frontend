import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const authUrl = "user/login";

// NextAuth options
const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const { data } = await api.post(authUrl, {
                        email: credentials.email,
                        password: credentials.password,
                    });

                    const loginData = data?.data;

                    if (loginData && loginData.authToken) {
                        // Return the full user + tokens
                        return {
                            ...loginData, // includes user, authToken, refreshToken
                        };
                    }
                    return null;
                } catch (error) {
                    console.error("Login error:", error.response?.data || error.message);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // Store everything in token
                token.user = user.user; // The actual user object
                token.authToken = user.authToken;
                token.refreshToken = user.refreshToken;
            }
            return token;
        },
        async session({ session, token }) {
            // Attach everything to session
            session.user = token.user;
            session.authToken = token.authToken;
            session.refreshToken = token.refreshToken;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = (req, res) => NextAuth(req, res, authOptions);
export { handler as GET, handler as POST };
