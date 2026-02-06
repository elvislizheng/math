import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import SecondaryNav from "@/components/SecondaryNav";
import Sidebar from "@/components/Sidebar";
import MobileSidebar from "@/components/MobileSidebar";
import { ProgressProvider } from "@/context/ProgressContext";

export const metadata: Metadata = {
  title: "Ontario Grade 7 Mathematics",
  description:
    "Practice app aligned to the Ontario Grade 7 Mathematics Curriculum (2020)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <ProgressProvider>
          <Header />
          <SecondaryNav />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 bg-bg-white">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
                {children}
              </div>
            </main>
          </div>
          <MobileSidebar />
        </ProgressProvider>
      </body>
    </html>
  );
}
