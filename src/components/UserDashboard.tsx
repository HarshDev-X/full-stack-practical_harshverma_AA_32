"use client"

import React from 'react';
import { SidebarProvider, SidebarInset, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { 
  Users, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Plus,
  Search,
  Activity,
  UserCheck,
  Clock
} from 'lucide-react';
import { UserTable } from './UserTable';
import { AddUserDialog } from './AddUserDialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function UserDashboard() {
  const auth = useAuth();
  const { user } = useUser();

  const handleLogout = () => signOut(auth);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r border-slate-200 bg-white shadow-xl">
          <SidebarHeader className="p-6 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl text-white shadow-lg shadow-primary/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black text-slate-900 tracking-tight">UserVault</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Admin Console</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <SidebarMenu>
              <div className="space-y-1">
                <SidebarMenuItem>
                  <SidebarMenuButton isActive className="bg-primary/5 text-primary">
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="font-bold">Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="text-slate-500 hover:text-primary transition-colors">
                    <Users className="w-4 h-4" />
                    <span className="font-bold">Directory</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="text-slate-500 hover:text-primary transition-colors">
                    <Activity className="w-4 h-4" />
                    <span className="font-bold">Audit Logs</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="text-slate-500 hover:text-primary transition-colors">
                    <Settings className="w-4 h-4" />
                    <span className="font-bold">System Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-slate-50">
            <div className="flex items-center justify-between px-2 mb-4">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 truncate max-w-[120px]">{user?.email}</span>
                <Badge variant="outline" className="text-[9px] h-4 mt-1 bg-emerald-50 text-emerald-600 border-emerald-100 uppercase">Administrator</Badge>
              </div>
            </div>
            <SidebarMenuButton onClick={handleLogout} className="text-rose-500 hover:bg-rose-50 hover:text-rose-600">
              <LogOut className="w-4 h-4" />
              <span className="font-bold">Sign Out</span>
            </SidebarMenuButton>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="bg-slate-50/50 flex flex-col p-6 lg:p-10">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Identity Registry</h1>
              <p className="text-slate-500 font-medium">Manage and provision cloud-native user profiles.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Filter users..." 
                  className="pl-10 h-11 bg-white border-slate-200 rounded-xl w-64 shadow-sm focus:ring-primary"
                />
              </div>
              <AddUserDialog />
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { label: "Active Profiles", value: "Live", icon: UserCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
              { label: "Database Latency", value: "14ms", icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
              { label: "Security Status", value: "Encrypted", icon: ShieldCheck, color: "text-orange-500", bg: "bg-orange-50" }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{stat.label}</p>
                  <p className="text-xl font-black text-slate-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
            <UserTable />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}