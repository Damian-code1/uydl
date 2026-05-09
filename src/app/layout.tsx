import type { Metadata } from "next";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";

export const metadata: Metadata = {
  title: "Uruguay Demon List",
  description: "UYDL - Lista oficial de demons y victors de Uruguay",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <ViewTransitions>
          <AppProviders>{children}</AppProviders>
        </ViewTransitions>
      </body>
    </html>
  );
}
