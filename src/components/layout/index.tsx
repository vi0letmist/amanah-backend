"use client";

import Header from "./header";
import Sidebar from "./sidebar";
import { useSidebar } from "@/context/SidebarContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isOpen } = useSidebar();
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page content */}
        <div
          className={`flex flex-col flex-1 overflow-hidden pt-16 ${
            isOpen ? "pl-64" : "pl-16"
          }`}
        >
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 py-4 px-8 md:py-8 md:px-16 pl-64">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
