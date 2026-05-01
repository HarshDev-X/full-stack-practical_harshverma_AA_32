import { SidebarProvider, SidebarInset, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { EndpointSection } from "@/components/EndpointSection";
import { ShieldCheck, Database, Server, Users, UserPlus, Search, Trash2, LogIn, Activity, Settings, Code, Terminal } from "lucide-react";

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-zinc-950 w-full">
        <Sidebar className="border-r border-zinc-800 bg-zinc-950">
          <SidebarHeader className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-xl text-black shadow-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white tracking-tight">UserVault</span>
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Core Engine</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3">
            <SidebarMenu>
              <div className="mt-8 mb-6">
                <p className="px-3 mb-2 text-[10px] font-bold uppercase text-zinc-600 tracking-[0.2em]">Environment</p>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive className="bg-zinc-900 text-white">
                    <Terminal className="w-4 h-4" />
                    <span className="font-medium">Sandbox Mode</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="text-zinc-400 hover:text-white">
                    <Code className="w-4 h-4" />
                    <span>Logs</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>

              <div className="mb-6">
                <p className="px-3 mb-2 text-[10px] font-bold uppercase text-zinc-600 tracking-[0.2em]">Endpoints</p>
                <div className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton className="text-zinc-400 hover:text-white">
                      <Activity className="w-4 h-4 text-emerald-500" />
                      <span>System</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="text-zinc-400 hover:text-white">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span>Users</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="text-zinc-400 hover:text-white">
                      <LogIn className="w-4 h-4 text-orange-500" />
                      <span>Auth</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </div>
              </div>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="bg-zinc-950 flex flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-12 lg:px-16">
            <header className="mb-16 max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-6">
                <Database className="w-3 h-3 text-white" />
                <span>Documentation & Runtime</span>
              </div>
              <h1 className="text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
                Scalable User Management <br />
                <span className="text-zinc-600 italic font-medium">Without the friction.</span>
              </h1>
              <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
                A hardened API interface for high-traffic applications. Test real-time database mutations, monitor system health, and secure admin sessions directly from this dashboard.
              </p>
            </header>

            <div className="space-y-24 pb-20">
              <section id="health" className="max-w-5xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-zinc-800"></div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
                    <Server className="w-4 h-4" /> System Control
                  </h3>
                  <div className="h-px flex-1 bg-zinc-800"></div>
                </div>
                <EndpointSection 
                  method="GET" 
                  path="/api/health" 
                  description="Global heart-beat check for Firestore connectivity and Auth availability." 
                />
              </section>

              <section id="users" className="max-w-5xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-zinc-800"></div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
                    <Users className="w-4 h-4" /> User Resources
                  </h3>
                  <div className="h-px flex-1 bg-zinc-800"></div>
                </div>
                <div className="grid gap-8">
                  <EndpointSection 
                    method="GET" 
                    path="/api/users" 
                    description="Fetch collection of all UserProfile documents currently in the vault." 
                  />
                  <EndpointSection 
                    method="POST" 
                    path="/api/users" 
                    description="Push a new UserProfile. Handles field validation and server timestamps." 
                    exampleBody={{ name: "Marcus Thorne", email: "marcus@vault.io" }}
                  />
                  <EndpointSection 
                    method="GET" 
                    path="/api/users/:id" 
                    description="Specific point-query to retrieve a singular user record by ID." 
                    hasParams={true}
                  />
                  <EndpointSection 
                    method="DELETE" 
                    path="/api/users/:id" 
                    description="Irrevocable deletion of a user profile from the database." 
                    hasParams={true}
                  />
                </div>
              </section>

              <section id="auth" className="max-w-5xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-zinc-800"></div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4" /> Authentication
                  </h3>
                  <div className="h-px flex-1 bg-zinc-800"></div>
                </div>
                <EndpointSection 
                  method="POST" 
                  path="/api/login" 
                  description="Elevate session to Administrator status. Use existing Firebase Auth credentials." 
                  exampleBody={{ email: "admin@gmail.com", password: "••••••••" }}
                />
              </section>
            </div>

            <footer className="pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-bold text-zinc-600 uppercase tracking-widest">
              <p>&copy; {new Date().getFullYear()} UserVault Core Labs</p>
              <div className="flex items-center gap-8">
                <a href="#" className="hover:text-white transition-colors">Infrastructure</a>
                <a href="#" className="hover:text-white transition-colors">Protocol</a>
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
              </div>
            </footer>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}