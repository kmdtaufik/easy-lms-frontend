import { createAuthClient } from "better-auth/react";
import { emailOTPClient, adminClient } from "better-auth/client/plugins";
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: "https://easy-lms-backend.vercel.app/",
  plugins: [emailOTPClient(), adminClient()],
});
