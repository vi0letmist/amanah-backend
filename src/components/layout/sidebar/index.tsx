"use client";

import React, { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ChevronLeft, LayoutGrid, Users } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

const Sidebar = () => {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <aside
      className={clsx(
        "fixed top-0 left-0 h-screen pt-16 z-50 flex flex-col bg-gray-900 text-gray-300 transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="absolute top-0 left-0 right-0 flex items-center justify-center h-[60px] bg-gray-800 z-50">
        {isOpen ? (
          <h2 className="text-xl font-bold text-white whitespace-nowrap">
            Amanah Backend
          </h2>
        ) : (
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 text-gray-800" />
          </div>
        )}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-2">
        <Link
          href="/"
          className={clsx(
            "flex items-center py-2 px-3 rounded-md hover:bg-gray-700 transition-colors duration-200",
            !isOpen && "justify-center"
          )}
        >
          <LayoutGrid className={clsx("w-6 h-6", isOpen && "mr-3")} />
          {isOpen && <span className="whitespace-nowrap">Dashboard</span>}
        </Link>
        <Link
          href="/data-user"
          className={clsx(
            "flex items-center py-2 px-3 rounded-md hover:bg-gray-700 transition-colors duration-200",
            !isOpen && "justify-center"
          )}
        >
          <Users className={clsx("w-6 h-6", isOpen && "mr-3")} />
          {isOpen && <span className="whitespace-nowrap">Data User</span>}
        </Link>
      </nav>

      <button
        onClick={toggleSidebar}
        className={clsx(
          "absolute top-1/2 -right-3 transform -translate-y-1/2 p-1 rounded-full bg-gray-700 text-white shadow-lg transition-transform duration-300 ease-in-out",
          !isOpen && "rotate-180"
        )}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    </aside>
  );
};

export default Sidebar;
