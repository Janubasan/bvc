import { cn } from "@/lib/utils";
import * as React from "react";
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "accent";
  size?: "default" | "sm" | "lg" | "icon";
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant="default", size="default", ...props }, ref) => {
  const variants: Record<string,string> = {
    default: "bg-teal-600 text-white hover:bg-teal-700 shadow-sm",
    secondary: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border bg-white hover:bg-slate-50 text-slate-700",
    ghost: "hover:bg-slate-100 text-slate-600",
    accent: "bg-orange-500 text-white hover:bg-orange-600 shadow-sm",
  };
  const sizes: Record<string,string> = {
    default: "h-9 px-4 py-2 text-sm",
    sm: "h-7 px-3 text-xs",
    lg: "h-11 px-8 text-sm",
    icon: "h-9 w-9",
  };
  return <button ref={ref} className={cn("inline-flex items-center justify-center rounded-xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:opacity-50", variants[variant], sizes[size], className)} {...props} />;
});
Button.displayName = "Button";
