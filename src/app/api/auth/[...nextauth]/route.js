import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const authUrl = "user/login";

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
                    const { data } = await api.post("user/login", {
                        email: credentials.email,
                        password: credentials.password,
                    });


                    const { token, user } = data;
                    if (token && user) {
                        return { ...user, accessToken: token }; // ✅ must return object
                    }

                    return null;
                } catch (error) {
                    console.error("Login error:", error.response?.data || error.message);
                    return null;
                }
            }

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
                token.accessToken = user.token; // backend token
                token.user = user.user || user; // ensure user object is stored
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user;
            session.accessToken = token.accessToken;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = (req, res) => NextAuth(req, res, authOptions);
export { handler as GET, handler as POST };
