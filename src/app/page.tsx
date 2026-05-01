import { SidebarProvider, SidebarInset, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { EndpointSection } from "@/components/EndpointSection";
import { Server, Users, UserPlus, LogIn, ShieldCheck, Database, Trash2, Search, Terminal, Activity, BookOpen, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full selection:bg-primary/10">
        <Sidebar className="border-r border-border/40">
          <SidebarHeader className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded shadow-sm">
                <ShieldCheck className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight">UserVault</span>
                <Badge variant="secondary" className="text-[10px] w-fit px-1.5 py-0 leading-tight h-4">v1.0.4-dev</Badge>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3 pb-4">
            <SidebarMenu>
              <div className="mt-4 mb-2">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3">Development</span>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive className="mt-2">
                    <Terminal className="w-4 h-4" />
                    <span>Playground</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <BookOpen className="w-4 h-4" />
                    <span>Reference</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>

              <div className="mt-6 mb-2">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3">Endpoints</span>
                <div className="space-y-1 mt-2">
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Activity className="w-4 h-4" />
                      <span>System</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Users className="w-4 h-4" />
                      <span>Users</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <LogIn className="w-4 h-4" />
                      <span>Authentication</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </div>
              </div>

              <div className="mt-auto pt-10">
                <SidebarMenuItem>
                  <SidebarMenuButton className="text-muted-foreground">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="api-gradient overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-12 lg:px-12">
            <header className="relative mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-medium border border-primary/10 mb-6">
                <Database className="w-3.5 h-3.5" />
                <span>Documentation & Playground</span>
              </div>
              <h1 className="text-5xl font-bold tracking-tight text-foreground mb-4">
                The User Management <br />
                <span className="text-muted-foreground/60 font-medium italic">Standard.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                A robust, Firestore-backed user directory API designed for high-scale applications. Test live endpoints, inspect real-time responses, and integrate seamlessly.
              </p>
            </header>

            <div className="space-y-24">
              <section id="health">
                <div className="flex items-center justify-between mb-8 border-b pb-4">
                  <div>
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                      <Server className="w-6 h-6 text-primary" /> System Health
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">Infrastructure and availability checks</p>
                  </div>
                </div>
                <div className="grid gap-6">
                  <EndpointSection 
                    method="GET" 
                    path="/api/health" 
                    description="Standard health check to monitor server uptime and Firebase connectivity." 
                  />
                </div>
              </section>

              <section id="users">
                <div className="flex items-center justify-between mb-8 border-b pb-4">
                  <div>
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                      <Users className="w-6 h-6 text-primary" /> User Directory
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">Full CRUD operations for vault members</p>
                  </div>
                </div>
                <div className="grid gap-6">
                  <EndpointSection 
                    method="GET" 
                    path="/api/users" 
                    description="Fetch all active user profiles from the Firestore collection." 
                  />
                  <EndpointSection 
                    method="POST" 
                    path="/api/users" 
                    description="Register a new profile. Automatically handles server timestamps and ID generation." 
                    exampleBody={{ name: "Alex Rivera", email: "alex@uservault.io" }}
                  />
                  <EndpointSection 
                    method="GET" 
                    path="/api/users/:id" 
                    description="Retrieve a single source of truth for a specific user ID." 
                    hasParams={true}
                  />
                  <EndpointSection 
                    method="DELETE" 
                    path="/api/users/:id" 
                    description="Permanently purge a user record. This action cannot be undone." 
                    hasParams={true}
                  />
                </div>
              </section>

              <section id="auth">
                <div className="flex items-center justify-between mb-8 border-b pb-4">
                  <div>
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                      <LogIn className="w-6 h-6 text-primary" /> Auth Services
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">Firebase Authentication endpoints</p>
                  </div>
                </div>
                <div className="grid gap-6">
                  <EndpointSection 
                    method="POST" 
                    path="/api/login" 
                    description="Verify administrator credentials against Firebase Auth." 
                    exampleBody={{ email: "admin@gmail.com", password: "••••••••" }}
                  />
                </div>
              </section>
            </div>

            <footer className="mt-32 pt-10 border-t flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} UserVault Infrastructure. Part of the DevScale Suite.</p>
              <div className="flex items-center gap-6 font-medium">
                <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                <a href="#" className="hover:text-primary transition-colors">Terms</a>
                <a href="#" className="hover:text-primary transition-colors">Support</a>
              </div>
            </footer>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}