"use client";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Search as SearchIcon,
  Bot,
  GitBranch,
  MessageSquare,
  Sheet,
  FileText,
  Settings,
  Sparkles,
  MapPinned,
  ShieldCheck,
  Zap,
  Building2,
  Plug,
  FileSpreadsheet,
  Rocket,
} from "lucide-react";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
  { id: "disparo", label: "Primeiro Disparo", icon: Rocket, badge: "AO VIVO" },
  { id: "goiania", label: "MRV — 8 Prédios", icon: Building2, badge: "EXCLUSIVO MRV" },
  { id: "prospectar", label: "Prospectar MRV", icon: SearchIcon, badge: "MRV" },
  { id: "harness", label: "Harness (n8n)", icon: GitBranch, badge: "8 fluxos" },
  { id: "exportador", label: "Exportador", icon: FileSpreadsheet, badge: "NOVO" },
  { id: "integracoes", label: "Integrações", icon: Plug, badge: "3 APIs" },
  { id: "leads", label: "Leads & CRM", icon: Sheet, badge: "1.847" },
  { id: "mensagens", label: "Mensagens MRV", icon: MessageSquare, badge: "8 validadas" },
  { id: "docs", label: "Docs & Sheets", icon: FileText, badge: null },
  { id: "agentes", label: "Agentes IA", icon: Bot, badge: "4 ativos" },
];

export function SidebarContent() {
  const { activeTab, setActiveTab } = useStore();
  return (
    <>
      <div className="px-5 py-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center font-black text-slate-900">
            BVC
          </div>
          <div>
            <div className="text-sm font-bold leading-none">BVC Prospector</div>
            <div className="text-[11px] text-slate-400">MCMV • Goiânia & Aparecida</div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-[11px] bg-green-900/50 border border-green-700 rounded-lg px-2.5 py-2">
          <MapPinned className="h-3.5 w-3.5 text-green-400" />
          <span>8 prédios MRV • Gran Porto Set/2027</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition text-left",
                active ? "bg-white text-slate-900 font-semibold" : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-bold", active ? "bg-slate-900 text-white" : "bg-slate-800 text-slate-300")}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-4 mt-4 border-t border-slate-800">
          <p className="px-3 text-[11px] font-semibold text-slate-400 tracking-widest uppercase">Inteligência</p>
          <div className="mt-2 space-y-2">
            <div className="mx-2 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 p-3 text-white">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Sparkles className="h-4 w-4" /> Pesquisa Global
              </div>
              <p className="text-[11px] opacity-90 mt-1 leading-relaxed">
                Estado da arte GitHub/HF adaptado para MCMV GO. Veja estudos completos.
              </p>
              <button onClick={() => setActiveTab("estudos")} className="mt-2 text-[11px] bg-white text-teal-700 px-2.5 py-1 rounded-full font-semibold">
                Ver dossiê →
              </button>
            </div>

            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-800">
              <ShieldCheck className="h-4 w-4" /> LGPD & Ética
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-800">
              <Zap className="h-4 w-4" /> Automações
            </button>
          </div>
        </div>
      </nav>

      <div className="p-3 border-t border-slate-800 space-y-2">
        <div className="flex items-center gap-2 bg-green-900/50 border border-green-700 rounded-xl px-3 py-2.5">
          <div className="h-7 w-7 rounded-full bg-green-500 flex items-center justify-center text-[11px] font-black">WA</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold leading-none">Seu WhatsApp</div>
            <div className="text-xs text-green-300 font-mono">+55 62 99902-3474</div>
          </div>
          <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
        </div>
        <div className="flex items-center gap-3 px-2 py-1.5">
          <img src="https://i.pravatar.cc/100?img=15" className="h-8 w-8 rounded-full" alt="" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium leading-none">Corretor MCMV</div>
            <div className="text-xs text-slate-400 truncate">Plantão Aparecida • CRECI 12.345</div>
          </div>
          <Settings className="h-4 w-4 text-slate-400" />
        </div>
      </div>
    </>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-[260px] shrink-0 bg-slate-900 text-slate-100 flex-col sticky top-0 h-screen">
      <SidebarContent />
    </aside>
  );
}
