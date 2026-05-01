import { SidebarProvider, SidebarInset, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { EndpointSection } from "@/components/EndpointSection";
import { ShieldCheck, Database, Server, Users, UserPlus, Search, Trash2, LogIn, Activity, Settings, Code, Terminal, Globe, Cpu } from "lucide-react";

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-50/50 w-full">
        <Sidebar className="border-r border-slate-200 bg-white">
          <SidebarHeader className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 bg-primary rounded-2xl text-white shadow-xl shadow-primary/20 transition-transform hover:scale-105 duration-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-slate-900 tracking-tight leading-none">UserVault</span>
                <span className="text-[10px] uppercase font-bold text-primary tracking-widest mt-1">Cloud Runtime</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-4 py-6">
            <SidebarMenu>
              <div className="mb-8">
                <p className="px-2 mb-3 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Environment</p>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive className="bg-primary/10 text-primary hover:bg-primary/20">
                    <Globe className="w-4 h-4" />
                    <span className="font-bold">Production Node</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="text-slate-500 hover:text-primary transition-colors">
                    <Cpu className="w-4 h-4" />
                    <span>Resource Monitor</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>

              <div className="mb-6">
                <p className="px-2 mb-3 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">API Core</p>
                <div className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton className="text-slate-600 hover:text-primary transition-all">
                      <Activity className="w-4 h-4 text-emerald-500" />
                      <span className="font-medium">System Health</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="text-slate-600 hover:text-primary transition-all">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">User Directory</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="text-slate-600 hover:text-primary transition-all">
                      <LogIn className="w-4 h-4 text-orange-500" />
                      <span className="font-medium">Admin Auth</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </div>
              </div>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="bg-transparent flex flex-col">
          <div className="flex-1 overflow-y-auto px-8 py-16 lg:px-20">
            <header className="mb-20 max-w-4xl relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-primary text-[10px] font-black uppercase tracking-wider mb-8 shadow-sm">
                <Database className="w-3.5 h-3.5" />
                <span>Live API Documentation</span>
              </div>
              <h1 className="text-6xl font-black text-slate-900 tracking-tight leading-[0.95] mb-8">
                Master Your Data <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient font-black">Velocity is Key.</span>
              </h1>
              <p className="text-xl text-slate-500 max-w-2xl leading-relaxed font-medium">
                High-performance user management infrastructure. Test mutations, monitor nodes, and secure admin endpoints with our unified interactive documentation.
              </p>
            </header>

            <div className="space-y-28 pb-24">
              <section id="system" className="max-w-6xl">
                <div className="flex items-center gap-6 mb-12">
                  <h3 className="text-sm font-black uppercase tracking-[0.4em] text-slate-400 whitespace-nowrap">
                    System Control
                  </h3>
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
                </div>
                <EndpointSection 
                  method="GET" 
                  path="/api/health" 
                  description="Real-time heartbeat check for database connectivity and auth modules." 
                />
              </section>

              <section id="resources" className="max-w-6xl">
                <div className="flex items-center gap-6 mb-12">
                  <h3 className="text-sm font-black uppercase tracking-[0.4em] text-slate-400 whitespace-nowrap">
                    Data Resources
                  </h3>
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
                </div>
                <div className="grid gap-12">
                  <EndpointSection 
                    method="GET" 
                    path="/api/users" 
                    description="Retrieve full collection of UserProfile documents from primary storage." 
                  />
                  <EndpointSection 
                    method="POST" 
                    path="/api/users" 
                    description="Initialize a new record. Automatically handles field normalization and timestamps." 
                    exampleBody={{ name: "Elena Rossi", email: "elena@uservault.io" }}
                  />
                  <EndpointSection 
                    method="GET" 
                    path="/api/users/:id" 
                    description="Point-query for a singular record. Requires a valid Document UUID." 
                    hasParams={true}
                  />
                  <EndpointSection 
                    method="DELETE" 
                    path="/api/users/:id" 
                    description="Irrevocable purge of a user profile from the primary database." 
                    hasParams={true}
                  />
                </div>
              </section>

              <section id="security" className="max-w-6xl">
                <div className="flex items-center gap-6 mb-12">
                  <h3 className="text-sm font-black uppercase tracking-[0.4em] text-slate-400 whitespace-nowrap">
                    Security Layer
                  </h3>
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
                </div>
                <EndpointSection 
                  method="POST" 
                  path="/api/login" 
                  description="Secure administrator authentication. Issues temporary access credentials." 
                  exampleBody={{ email: "admin@gmail.com", password: "••••••••" }}
                />
              </section>
            </div>

            <footer className="pt-16 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <p>&copy; {new Date().getFullYear()} UserVault Infrastructure</p>
              </div>
              <div className="flex items-center gap-10">
                <a href="#" className="hover:text-primary transition-colors">Architecture</a>
                <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                <a href="#" className="hover:text-primary transition-colors">Docs</a>
              </div>
            </footer>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}