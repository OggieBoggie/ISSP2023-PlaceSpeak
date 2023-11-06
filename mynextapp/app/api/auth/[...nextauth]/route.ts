import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Send a post request to your Django backend to save user details
      const res = await fetch("http://127.0.0.1:8000/myapp/api/saveuser/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          image: user.image,
        }),
      });
      // Check if the user was saved successfully
      if (res.ok) {
        return true; // Allow sign-in
      } else {
        console.error("Failed to save user data to the backend.");
        return false; // Deny sign-in if there was an error
      }
    },
  },
});

export { handler as GET, handler as POST };
