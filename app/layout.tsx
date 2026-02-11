import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip"


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "E-Commerce IMS",
  description: "An Inventory Management System Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" className={inter.className} suppressHydrationWarning={true}>
        <body
          className={`${inter.className} ${inter.className} antialiased`}
        >
          <ThemeProvider attribute={"class"} defaultTheme={"system"} enableSystem={true} disableTransitionOnChange={true}>
            <TooltipProvider>
              {children}
            </TooltipProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
