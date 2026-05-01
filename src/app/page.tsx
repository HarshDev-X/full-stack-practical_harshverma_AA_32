"use client"

import { useUser } from "@/firebase";
import { UserDashboard } from "@/components/UserDashboard";
import { LoginForm } from "@/components/LoginForm";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Initializing Vault...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/50">
      {user ? <UserDashboard /> : <LoginForm />}
    </main>
  );
}