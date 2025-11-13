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
                    
                    if (token && user) {
                        return {
                            id: user.id,
                            email: user.email,
                            name: user.name || `${user.firstname || ''} ${user.lastname || ''}`.trim(),
                            role: user.role,
                            accessToken: token,
                            ...user,
                        };
                    }
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
                    const payload = {
                        email: profile.email,
                        firstname: profile.name.split(" ")[0],
                        lastname: profile.name.split(" ")[1] || "",
                        googleId: profile.sub,
                        isGoogleUser: true,
                    };
                    console.log("Google signup payload:", payload);
                    
                    const res = await api.post("/user", payload);
                    const { token: backendToken, user: backendUser } = res.data;
                    
                    console.log("Google user created/retrieved:", backendUser);
                    
                    // Set all required user properties including role
                    user.accessToken = backendToken;
                    user.id = backendUser.id;
                    user.email = backendUser.email;
                    user.name = backendUser.name || `${backendUser.firstname || ''} ${backendUser.lastname || ''}`.trim();
                    user.role = backendUser.role; // ✅ Important: get role from backend
                    user.googleId = backendUser.googleId;
                    
                    return true;
                } catch (err) {
                    console.error("Google signin error details:", {
                        status: err.response?.status,
                        data: err.response?.data,
                        message: err.message,
                    });
                    const status = err.response?.status;
                    if (status === 409) {
                        // User already exists - try to get their full data
                        try {
                            const existingUserRes = await api.get(`/user/email/${profile.email}`);
                            const existingUser = existingUserRes.data;
                            user.id = existingUser.id;
                            user.email = existingUser.email;
                            user.role = existingUser.role; // Get existing user's role
                            user.name = existingUser.name || `${existingUser.firstname || ''} ${existingUser.lastname || ''}`.trim();
                            return true;
                        } catch (getErr) {
                            console.error("Error fetching existing user:", getErr);
                            return `${process.env.NEXTAUTH_URL}/login?error=EMAIL_EXISTS`;
                        }
                    }
                    return `${process.env.NEXTAUTH_URL}/login?error=GOOGLE_SIGNIN_FAILED`;
                }
            }
            return true;
        },

        async jwt({ token, user, account }) {
            // When user first logs in
            if (user) {
                token.user = {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role, // ✅ Store role in token
                };
                token.accessToken = user.accessToken;
            }
            
            if (account?.access_token) {
                token.providerAccessToken = account.access_token;
            }
            
            return token;
        },

        async session({ session, token }) {
            // Copy user data from JWT token to session
            if (token?.user) {
                session.user = {
                    ...session.user,
                    ...token.user,
                };
            }
            session.accessToken = token.accessToken;
            session.providerAccessToken = token.providerAccessToken;
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };