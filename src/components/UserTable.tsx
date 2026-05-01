"use client"

import React from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Mail, Calendar, User, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export function UserTable() {
  const db = useFirestore();
  const { toast } = useToast();
  const usersRef = collection(db, 'users');
  const q = query(usersRef, orderBy('createdAt', 'desc'));
  const { data: users, loading } = useCollection<any>(q);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      toast({ title: "User Purged", description: "Profile record has been permanently removed." });
    } catch (e) {
      toast({ variant: "destructive", title: "Action Failed", description: "You do not have permissions to delete users." });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Fetching Registry...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-20 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Users className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Registry is Empty</h3>
        <p className="text-slate-500">No identity profiles found in the cloud node.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader className="bg-slate-50/50">
        <TableRow>
          <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 py-6 pl-8">Identity</TableHead>
          <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Status</TableHead>
          <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Provisioned</TableHead>
          <TableHead className="w-[100px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id} className="group hover:bg-slate-50/50 transition-colors">
            <TableCell className="pl-8 py-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-primary group-hover:text-white transition-all">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-slate-900 text-sm tracking-tight">{user.name}</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1.5"><Mail className="w-3 h-3" /> {user.email}</span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="text-[10px] px-2.5 py-0.5 rounded-lg border-emerald-100 bg-emerald-50 text-emerald-600 font-bold uppercase tracking-wider">
                Active Node
              </Badge>
            </TableCell>
            <TableCell>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
              </span>
            </TableCell>
            <TableCell className="pr-8">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all">
                    <MoreHorizontal className="h-4 w-4 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl p-2 shadow-2xl border-slate-100">
                  <DropdownMenuItem 
                    onClick={() => handleDelete(user.id)}
                    className="text-rose-500 focus:text-rose-600 focus:bg-rose-50 rounded-lg font-bold"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Purge Profile
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}