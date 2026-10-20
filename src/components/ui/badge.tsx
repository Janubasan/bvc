import { cn } from "@/lib/utils";
export function Badge({ className, variant="default", ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: "default"|"secondary"|"success"|"warning"|"outline" }) {
  const variants: Record<string,string> = {
    default: "bg-slate-900 text-white",
    secondary: "bg-slate-100 text-slate-700",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    outline: "border bg-white text-slate-700",
  };
  return <div className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", variants[variant], className)} {...props} />;
}
