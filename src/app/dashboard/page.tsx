import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard";

export default async function Page() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      redirect("/signin");
    }
    return <Dashboard user={session.user} />;
  } catch (error) {
    console.error("Dashboard authentication error:", error);
    redirect("/signin");
  }
}