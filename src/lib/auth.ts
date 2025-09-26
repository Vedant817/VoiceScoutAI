import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  // Enable email/password provider
  emailAndPassword: {
    enabled: true, // <-- This enables email/password signup and signin!
    // Configuration options:
    expireIn: "7d", // session length
    updateAge: "1d", // session refresh interval
    // Optionally, you may also specify minPasswordLength, requireEmailVerification, etc
  },
  plugins: [nextCookies()],
});
