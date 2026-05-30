import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "PostCanvas - Create Beautiful Social Media Graphics",
  description: "The fast, free, and beautiful way to design your perfect graphic. Full support for Arabic typography, custom templates, and lightning-fast exports.",
  openGraph: {
    type: "website",
    title: "PostCanvas - Create Beautiful Social Media Graphics",
    description: "The fast, free, and beautiful way to design your perfect graphic.",
    siteName: "PostCanvas",
  },
  twitter: {
    card: "summary_large_image",
    title: "PostCanvas",
    description: "Design beautiful graphics in your browser.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        <TooltipProvider>
          <Providers>{children}</Providers>
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
