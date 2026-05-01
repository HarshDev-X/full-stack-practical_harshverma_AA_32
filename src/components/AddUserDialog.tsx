"use client"

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, Sparkles } from "lucide-react";
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export function AddUserDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  
  const db = useFirestore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'users'), {
        ...formData,
        createdAt: new Date().toISOString(),
        status: 'active'
      });
      toast({ title: "Profile Provisioned", description: `${formData.name} is now registered in the cloud.` });
      setFormData({ name: '', email: '' });
      setOpen(false);
    } catch (err) {
      toast({ variant: "destructive", title: "Provisioning Failed", description: "Security protocols blocked document creation." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white font-black uppercase text-[10px] tracking-[0.2em] h-11 px-6 rounded-xl shadow-lg shadow-primary/20 gap-2">
          <Plus className="w-4 h-4" /> Provision Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2rem] border-none p-0 overflow-hidden shadow-2xl max-w-md">
        <div className="bg-primary p-10 text-white relative">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Sparkles className="w-24 h-24" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-3xl font-black tracking-tight mb-2">New Identity</DialogTitle>
            <DialogDescription className="text-primary-foreground/80 font-medium">
              Create a cloud-native identity document in the registry.
            </DialogDescription>
          </DialogHeader>
        </div>
        <form onSubmit={handleSubmit} className="p-10 space-y-8 bg-white">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Legal Name</Label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Marcus Aurelius" 
                className="h-14 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary focus:bg-white transition-all font-medium"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Identifier</Label>
              <Input 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="marcus@rome.io" 
                className="h-14 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary focus:bg-white transition-all font-medium"
                required
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="flex-1 h-14 rounded-2xl font-bold text-slate-500">Cancel</Button>
            <Button disabled={loading} className="flex-[2] h-14 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-slate-200">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Commit Record"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}