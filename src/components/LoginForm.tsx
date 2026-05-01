"use client"

import React, { useState } from 'react';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Card, CardContent, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Welcome back!", description: "Authenticated successfully." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Access Denied", description: "Invalid credentials." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none"></div>
      
      <div className="w-full max-w-md relative animate-in fade-in zoom-in-95 duration-700">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-primary rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-primary/40 mb-6 animate-float">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">UserVault</h2>
          <p className="text-slate-500 font-medium">Cloud Infrastructure Administrator Node</p>
        </div>

        <Card className="rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border-none bg-white/80 backdrop-blur-xl overflow-hidden">
          <CardHeader className="pt-10 pb-4 text-center">
            <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Security Gate</p>
          </CardHeader>
          <CardContent className="p-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Identity UID</p>
                <Input 
                  type="email" 
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary focus:bg-white transition-all font-medium"
                  required
                />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Access Token</p>
                <Input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary focus:bg-white transition-all"
                  required
                />
              </div>
              <Button 
                disabled={loading} 
                className="w-full h-16 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 font-black uppercase text-[11px] tracking-[0.2em] shadow-xl transition-all active:scale-[0.98]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="flex items-center gap-2">Authorize Access <ArrowRight className="w-4 h-4" /></span>}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
          Authorized Nodes Only &bull; Protocol V1.0
        </p>
      </div>
    </div>
  );
}