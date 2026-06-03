'use client';

import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { LayoutDashboard, Database, ClipboardList, TrendingUp, Settings, Users, LogOut, Bell, ShieldCheck, GraduationCap, Zap, Newspaper, AlertCircle, AlertTriangle, FileText, Activity, ShieldAlert, HeartPulse, HelpCircle } from "lucide-react"
import Link from "next/link"
import Logo from "@/components/brand/Logo"
import { useUser, useAuth } from "@/firebase"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { signOut } from "firebase/auth"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useUser()
  const auth = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const isFounder = user?.email === 'arshdeepgrewal1122@gmail.com';
  const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN' || isFounder;

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/login')
    }
  }, [user, profile, loading, router, isAdmin])

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/login')
  }

  if (loading) return <div className="h-screen w-full bg-[#0F172A] flex items-center justify-center"><ShieldCheck className="h-10 w-10 text-primary animate-pulse" /></div>
  
  if (!user || !isAdmin) return null

  const displayName = profile?.name || user?.displayName || 'System Admin';

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-white">
        <Sidebar className="border-r border-white/5 bg-[#0F172A]">
          <SidebarHeader className="p-6">
            <Logo variant="light" className="scale-90 origin-left" />
          </SidebarHeader>
          <SidebarContent className="custom-scrollbar overflow-x-hidden">
            <SidebarGroup>
              <SidebarGroupLabel className="px-6 text-xs font-black uppercase tracking-widest text-white/20">Data Operations</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <AdminNavItem icon={<Database />} label="MCQ Bank" href="/admin/questions" active={pathname === "/admin/questions"} />
                  <AdminNavItem icon={<Zap className="text-primary fill-primary/20" />} label="Bulk Import" href="/admin/questions/bulk" active={pathname === "/admin/questions/bulk"} />
                  <AdminNavItem icon={<ClipboardList />} label="Mock Builder" href="/admin/mocks" active={pathname === "/admin/mocks"} />
                  <AdminNavItem icon={<ShieldAlert className="text-rose-500" />} label="Integrity QA" href="/admin/qa" active={pathname === "/admin/qa"} />
                  <AdminNavItem icon={<AlertTriangle className="text-rose-400" />} label="Audit Flags" href="/admin/reports" active={pathname === "/admin/reports"} />
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="px-6 text-xs font-black uppercase tracking-widest text-white/20">Content Engine</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <AdminNavItem icon={<Newspaper className="text-emerald-400" />} label="Daily Analysis" href="/admin/current-affairs" active={pathname === "/admin/current-affairs"} />
                  <AdminNavItem icon={<AlertCircle className="text-orange-400" />} label="Exam Gazette" href="/admin/notifications" active={pathname === "/admin/notifications"} />
                  <AdminNavItem icon={<FileText className="text-blue-400" />} label="PYQ Archives" href="/admin/pyqs" active={pathname === "/admin/pyqs"} />
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="px-6 text-xs font-black uppercase tracking-widest text-white/20">Core Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <AdminNavItem icon={<LayoutDashboard />} label="Command Center" href="/admin" active={pathname === "/admin"} />
                  <AdminNavItem icon={<HeartPulse className="text-rose-400" />} label="System Health" href="/admin/health" active={pathname === "/admin/health"} />
                  <AdminNavItem icon={<HelpCircle className="text-blue-400" />} label="Support Hub" href="/admin/support" active={pathname === "/admin/support"} />
                  <AdminNavItem icon={<GraduationCap />} label="Exams & Boards" href="/admin/exams" active={pathname === "/admin/exams"} />
                  <AdminNavItem icon={<Users />} label="Aspirant Registry" href="/admin/users" active={pathname === "/admin/users"} />
                  <AdminNavItem icon={<Activity />} label="Audit Logs" href="/admin/audit-logs" active={pathname === "/admin/audit-logs"} />
                  <AdminNavItem icon={<TrendingUp />} label="Analytics Engine" href="/admin/analytics" active={pathname === "/admin/analytics"} />
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-auto pb-8">
              <SidebarMenu>
                {(profile?.role === 'SUPER_ADMIN' || isFounder) && (
                  <AdminNavItem icon={<Settings />} label="Portal Settings" href="/admin/settings" active={pathname === "/admin/settings"} />
                )}
                <SidebarMenuItem>
                   <SidebarMenuButton onClick={handleLogout} className="px-6 text-destructive/70 hover:bg-destructive/10 hover:text-destructive transition-colors h-11">
                    <LogOut className="size-4 mr-3 shrink-0" /> <span className="font-bold">Logout Portal</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <SidebarInset className="flex flex-col bg-white">
          <header className="h-16 border-b border-slate-200 flex items-center px-6 justify-between bg-white sticky top-0 z-40 shadow-sm">
            <div className="flex items-center gap-4 min-w-0">
              <SidebarTrigger className="text-[#0F172A]" />
              <div className="h-4 w-[1px] bg-slate-200 mx-2 hidden sm:block" />
              <div className="flex items-center gap-2 truncate">
                 <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0F172A] truncate">Management System</span>
              </div>
            </div>
            <div className="flex items-center gap-6 shrink-0">
              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-xs font-black leading-none truncate max-w-[150px] text-[#0F172A] uppercase">{displayName}</p>
                  <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-1">
                    {profile?.role === 'SUPER_ADMIN' || isFounder ? 'Lead Authority' : 'Content Admin'}
                  </p>
                </div>
                <div className="h-9 w-9 rounded-xl bg-[#0F172A] flex items-center justify-center border border-[#0F172A]">
                  <span className="font-black text-white text-xs">{displayName.split(' ').map(n => n[0]).join('')}</span>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 p-8 overflow-y-auto bg-white">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

function AdminNavItem({ icon, label, href, active }: { icon: React.ReactNode, label: string, href: string, active?: boolean }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        asChild 
        isActive={active}
        className={`px-6 transition-all font-medium h-11 group ${active ? 'bg-white/5 text-primary' : 'hover:bg-white/5 hover:text-primary text-white/60'}`}
      >
        <Link href={href} className="flex items-center gap-3 w-full">
          <div className="shrink-0 flex items-center justify-center size-4">
            {icon}
          </div>
          <span className="font-bold tracking-tight truncate">{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}