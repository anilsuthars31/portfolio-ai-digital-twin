import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Aurora from "@/components/Aurora";
import ChatWidget from "@/components/ChatWidget";
import Navbar from "@/components/Navbar";
import { getProfile } from "@/lib/profile";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateMetadata(): Metadata {
  const { name, tagline } = getProfile();
  return { title: `${name} — Portfolio`, description: tagline };
}

// Applies the saved/system theme before paint to avoid a light-mode flash.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  const { name } = getProfile();
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="relative isolate min-h-full flex flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 font-sans">
        <Aurora />
        <Navbar name={name} />
        {children}
        <ChatWidget name={name} />
      </body>
    </html>
  );
}
