"use client";
import { Bell, Search, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

export function Topbar() {
  return (
    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
      <div className="flex items-center justify-between px-6 py-3 gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              placeholder="Buscar leads, bairros, construtoras, templates…"
              className="w-full h-9 pl-9 pr-3 rounded-xl border bg-slate-50 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Harness agêntico rodando • 6.2k execuções/dia
          </div>
          <Button variant="outline" size="sm" onClick={() => window.open("https://docs.google.com/spreadsheets", "_blank")}>
            <ExternalLink className="h-4 w-4 mr-1" /> Google Sheets
          </Button>
          <Button variant="ghost" size="icon"><Bell className="h-4 w-4" /></Button>
          <img src="https://i.pravatar.cc/100?img=33" alt="user" className="h-8 w-8 rounded-full border" />
        </div>
      </div>
    </div>
  );
}
