import { SidebarProvider, SidebarInset, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { EndpointSection } from "@/components/EndpointSection";
import { Server, Users, UserPlus, LogIn, ShieldCheck, Database, Trash2, Search } from "lucide-react";

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full">
        <Sidebar className="border-r shadow-sm">
          <SidebarHeader className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg text-white shadow-lg shadow-primary/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold font-headline tracking-tight">UserVault</h1>
                <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-widest">API v1.0.0</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-4">
            <SidebarMenu>
              <div className="mb-4">
                <p className="px-2 mb-2 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">System</p>
                <SidebarMenuItem>
                  <SidebarMenuButton className="hover:bg-secondary">
                    <Server className="w-4 h-4 mr-2" />
                    <span>Health Check</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>

              <div className="mb-4">
                <p className="px-2 mb-2 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Users API</p>
                <SidebarMenuItem>
                  <SidebarMenuButton className="hover:bg-secondary">
                    <Users className="w-4 h-4 mr-2" />
                    <span>List All Users</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="hover:bg-secondary">
                    <UserPlus className="w-4 h-4 mr-2" />
                    <span>Create User</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="hover:bg-secondary">
                    <Search className="w-4 h-4 mr-2" />
                    <span>Get by ID</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="hover:bg-secondary">
                    <Trash2 className="w-4 h-4 mr-2" />
                    <span>Delete User</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>

              <div>
                <p className="px-2 mb-2 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Auth</p>
                <SidebarMenuItem>
                  <SidebarMenuButton className="hover:bg-secondary">
                    <LogIn className="w-4 h-4 mr-2" />
                    <span>Admin Login</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1 p-8 lg:p-12">
          <div className="max-w-4xl mx-auto">
            <header className="mb-12">
              <div className="flex items-center gap-2 text-primary mb-2 font-semibold">
                <Database className="w-5 h-5" />
                <span>API Playground</span>
              </div>
              <h2 className="text-4xl font-headline font-bold mb-4 tracking-tight">Interactive Documentation</h2>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Welcome to UserVault. This interactive dashboard allows you to explore, test, and integrate with our high-performance User Management API. All responses follow a standard JSON structure.
              </p>
            </header>

            <div className="grid gap-12">
              <section id="health">
                <h3 className="text-2xl font-headline font-semibold mb-6 flex items-center gap-2">
                  <Server className="w-6 h-6 text-primary" /> System Health
                </h3>
                <EndpointSection 
                  method="GET" 
                  path="/api/health" 
                  description="Check if the API server is currently reachable and running." 
                />
              </section>

              <section id="users">
                <h3 className="text-2xl font-headline font-semibold mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" /> User Resources
                </h3>
                <EndpointSection 
                  method="GET" 
                  path="/api/users" 
                  description="Retrieve a complete list of all users registered in the vault." 
                />
                <EndpointSection 
                  method="POST" 
                  path="/api/users" 
                  description="Register a new user in the system. Validates for unique email and required fields." 
                  exampleBody={{ name: "New User", email: "newuser@example.com" }}
                />
                <EndpointSection 
                  method="GET" 
                  path="/api/users/:id" 
                  description="Fetch detailed information for a specific user based on their unique identifier." 
                  hasParams={true}
                />
                <EndpointSection 
                  method="DELETE" 
                  path="/api/users/:id" 
                  description="Permanently remove a user record from the vault." 
                  hasParams={true}
                />
              </section>

              <section id="auth">
                <h3 className="text-2xl font-headline font-semibold mb-6 flex items-center gap-2">
                  <LogIn className="w-6 h-6 text-primary" /> Authentication
                </h3>
                <EndpointSection 
                  method="POST" 
                  path="/api/login" 
                  description="Authenticate as an administrator. Use 'admin@gmail.com' and '1234' for testing." 
                  exampleBody={{ email: "admin@gmail.com", password: "1234" }}
                />
              </section>
            </div>

            <footer className="mt-20 pt-8 border-t text-center text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} UserVault API. All operations logged at current time.</p>
            </footer>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
