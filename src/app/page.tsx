import { SidebarProvider, SidebarInset, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { EndpointSection } from "@/components/EndpointSection";
import { ShieldCheck, Database, Activity, Users, LogIn, Cpu, Globe, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-50/50 w-full overflow-hidden">
        <Sidebar className="border-r border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          <SidebarHeader className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 bg-primary rounded-2xl text-white shadow-xl shadow-primary/30 transition-transform hover:rotate-3 duration-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-slate-900 tracking-tight leading-none">UserVault</span>
                <span className="text-[10px] uppercase font-bold text-primary tracking-widest mt-1">Cloud Engine</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-4 py-8">
            <SidebarMenu>
              <div className="mb-10">
                <p className="px-3 mb-4 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Deployment</p>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive className="bg-primary/5 text-primary hover:bg-primary/10 mb-1">
                    <Globe className="w-4 h-4" />
                    <span className="font-bold">Production-US-East</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="text-slate-500 hover:text-primary">
                    <Cpu className="w-4 h-4" />
                    <span className="font-medium">Edge Compute</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>

              <div>
                <p className="px-3 mb-4 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">API Registry</p>
                <div className="space-y-1">
                  <SidebarMenuItem>
                    <a href="#system">
                      <SidebarMenuButton className="text-slate-600 hover:text-primary hover:bg-slate-50 transition-all rounded-lg">
                        <Activity className="w-4 h-4 text-emerald-500" />
                        <span className="font-bold">System Status</span>
                      </SidebarMenuButton>
                    </a>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <a href="#users">
                      <SidebarMenuButton className="text-slate-600 hover:text-primary hover:bg-slate-50 transition-all rounded-lg">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className="font-bold">User Management</span>
                      </SidebarMenuButton>
                    </a>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <a href="#security">
                      <SidebarMenuButton className="text-slate-600 hover:text-primary hover:bg-slate-50 transition-all rounded-lg">
                        <LogIn className="w-4 h-4 text-orange-500" />
                        <span className="font-bold">Security Gate</span>
                      </SidebarMenuButton>
                    </a>
                  </SidebarMenuItem>
                </div>
              </div>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="bg-transparent flex flex-col overflow-y-auto">
          <div className="flex-1 px-8 py-12 lg:px-24">
            <header className="mb-20 max-w-5xl">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-wider mb-10 shadow-sm transition-all hover:border-primary/50 cursor-default">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Database className="w-3.5 h-3.5" />
                <span>Real-Time Node Explorer</span>
              </div>
              <h1 className="text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8">
                Build Fast. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient font-black">Stay Robust.</span>
              </h1>
              <p className="text-xl text-slate-500 max-w-2xl leading-relaxed font-medium">
                High-frequency user infrastructure powered by Firebase. Test, mutate, and manage your data with our enterprise documentation interface.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                {[
                  { label: "API Uptime", value: "99.99%", icon: Activity, color: "text-emerald-500" },
                  { label: "Latency", value: "24ms", icon: Clock, color: "text-blue-500" },
                  { label: "Security Nodes", value: "Active", icon: CheckCircle2, color: "text-orange-500" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md group">
                    <div className="flex items-center justify-between mb-4">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-2xl font-black text-slate-900 mb-1">{stat.value}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>
            </header>

            <div className="space-y-32 pb-32">
              <section id="system" className="scroll-mt-12">
                <div className="flex items-center gap-6 mb-12">
                  <h3 className="text-sm font-black uppercase tracking-[0.4em] text-slate-400 whitespace-nowrap">
                    Core Control
                  </h3>
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
                </div>
                <EndpointSection 
                  method="GET" 
                  path="/api/health" 
                  description="System heartbeat and node connectivity check." 
                />
              </section>

              <section id="users" className="scroll-mt-12">
                <div className="flex items-center gap-6 mb-12">
                  <h3 className="text-sm font-black uppercase tracking-[0.4em] text-slate-400 whitespace-nowrap">
                    Data Records
                  </h3>
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
                </div>
                <div className="grid gap-12">
                  <EndpointSection 
                    method="GET" 
                    path="/api/users" 
                    description="Fetch all active user profiles from cloud storage." 
                  />
                  <EndpointSection 
                    method="POST" 
                    path="/api/users" 
                    description="Provision a new identity document in the registry." 
                    exampleBody={{ name: "Marcus Aurelius", email: "marcus@rome.io" }}
                  />
                  <EndpointSection 
                    method="GET" 
                    path="/api/users/:id" 
                    description="Point-query for a specific profile by unique ID." 
                    hasParams={true}
                  />
                  <EndpointSection 
                    method="DELETE" 
                    path="/api/users/:id" 
                    description="Purge a record from the cloud storage cluster." 
                    hasParams={true}
                  />
                </div>
              </section>

              <section id="security" className="scroll-mt-12">
                <div className="flex items-center gap-6 mb-12">
                  <h3 className="text-sm font-black uppercase tracking-[0.4em] text-slate-400 whitespace-nowrap">
                    Security Layer
                  </h3>
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
                </div>
                <EndpointSection 
                  method="POST" 
                  path="/api/login" 
                  description="Verify administrator credentials and issue access tokens." 
                  exampleBody={{ email: "admin@gmail.com", password: "••••••••" }}
                />
              </section>
            </div>

            <footer className="pt-16 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <p>&copy; {new Date().getFullYear()} UserVault Cloud Infrastructure</p>
              </div>
              <div className="flex items-center gap-12">
                <a href="#" className="hover:text-primary transition-colors">Protocol</a>
                <a href="#" className="hover:text-primary transition-colors">Nodes</a>
                <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              </div>
            </footer>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
