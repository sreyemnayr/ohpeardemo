import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@radix-ui/react-tooltip";

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
});

export const metadata: Metadata = {
  title: "OhPear",
  description: "Family management made easy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="https://use.typekit.net/lwq8tni.css" as="style" />
        <link rel="stylesheet" href="https://use.typekit.net/lwq8tni.css" />
      </head>
      <body className={`${quicksand.variable} font-sans`}>
        <TooltipProvider delayDuration={100}>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
