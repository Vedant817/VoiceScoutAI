"use server";
import { auth } from "@/lib/auth";

// Sign Up using email, name, and password
export async function signUp(email: string, name: string, password: string) {
  await auth.api.signUpEmail({
    body: { email, name, password }, // Must include all required fields
  });
}

// Sign In using email and password
export async function signIn(email: string, password: string) {
  await auth.api.signInEmail({
    body: { email, password },
  });
}
