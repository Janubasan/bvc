"use client";
import { create } from "zustand";
import { LEADS_MOCK, Lead } from "./data";

type Store = {
  leads: Lead[];
  selectedLead: Lead | null;
  activeTab: string;
  prospectingRunning: boolean;
  workflowRunning: boolean;
  setActiveTab: (t: string) => void;
  setProspectingRunning: (v: boolean) => void;
  setWorkflowRunning: (v: boolean) => void;
  setSelectedLead: (l: Lead | null) => void;
  addLead: (l: Lead) => void;
  updateLeadStatus: (id: string, status: Lead["status"]) => void;
};

export const useStore = create<Store>((set) => ({
  leads: LEADS_MOCK,
  selectedLead: null,
  activeTab: "dashboard",
  prospectingRunning: false,
  workflowRunning: true,
  setActiveTab: (activeTab) => set({ activeTab }),
  setProspectingRunning: (prospectingRunning) => set({ prospectingRunning }),
  setWorkflowRunning: (workflowRunning) => set({ workflowRunning }),
  setSelectedLead: (selectedLead) => set({ selectedLead }),
  addLead: (lead) => set((s) => ({ leads: [lead, ...s.leads] })),
  updateLeadStatus: (id, status) =>
    set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, status } : l)) })),
}));
