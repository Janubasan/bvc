"use client";
import { Sidebar, SidebarContent } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Dashboard } from "@/components/Dashboard";
import { Prospector } from "@/components/Prospector";
import { Harness } from "@/components/Harness";
import { Leads } from "@/components/Leads";
import { Mensagens } from "@/components/Mensagens";
import { MRVMensagens } from "@/components/MRVMensagens";
import { Docs } from "@/components/Docs";
import { Agentes } from "@/components/Agentes";
import { Estudos } from "@/components/Estudos";
import { MRVSystem } from "@/components/MRVSystem";
import { Integracoes } from "@/components/Integracoes";
import { Exportador } from "@/components/Exportador";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const { activeTab } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const render = () => {
    switch (activeTab) {
      case "dashboard": return <Dashboard />;
      case "goiania": return <MRVSystem />;
      case "prospectar": return <Prospector />;
      case "agentes": return <Agentes />;
      case "harness": return <Harness />;
      case "exportador": return <Exportador />;
      case "integracoes": return <Integracoes />;
      case "mensagens": return <MRVMensagens />;
      case "mensagens-antigas": return <Mensagens />;
      case "leads": return <Leads />;
      case "docs": return <Docs />;
      case "estudos": return <Estudos />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-slate-900 flex flex-col overflow-auto">
            <SidebarContent />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="lg:hidden flex items-center gap-2 px-4 py-3 bg-slate-900 text-white sticky top-0 z-20">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="font-bold text-sm">BVC Prospector • MCMV GO</div>
          <div className="ml-auto text-xs bg-white/10 px-2 py-1 rounded-full">8 leads hoje</div>
        </div>

        <Topbar />
        <main className="flex-1 p-4 md:p-6 max-w-[1400px] w-full mx-auto">{render()}</main>

        <footer className="border-t bg-white px-6 py-3 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-2">
          <span>© 2026 BVC Prospector • MCMV Goiânia & Aparecida de Goiânia • Harness agêntico estilo n8n • LGPD-first • Feito para corretores que fecham</span>
          <span className="flex items-center gap-2">Stack: Next.js 14 • n8n 160k★ • Scout • Apify • Qwen3-8B • Google Workspace</span>
        </footer>
      </div>
    </div>
  );
}
