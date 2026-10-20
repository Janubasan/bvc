import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BVC Prospector — MCMV Goiânia & Aparecida | Agente Avançado de Leads",
  description: "O prospector MCMV mais avançado do Brasil. Instagram de construtoras + intent finança/moradia + harness n8n agêntico + entrega Google Sheets/Docs. Para Goiânia & Aparecida de Goiânia.",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
