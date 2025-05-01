
import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { Header } from "../header";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 pt-16">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
