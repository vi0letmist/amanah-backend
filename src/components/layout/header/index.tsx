"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/SidebarContext";

const Header = () => {
  const { isOpen } = useSidebar();
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  const formatBreadcrumb = (segment: string) => {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-gray-800 text-white shadow-md h-16">
      <div
        className={`flex items-center space-x-4 ${isOpen ? "pl-64" : "pl-16"}`}
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
        </div>

        <nav className="hidden md:flex text-sm ml-6">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-gray-300 transition-colors">
                Home
              </Link>
            </li>
            {pathSegments.map((segment, index) => (
              <li key={segment} className="flex items-center">
                <span className="mx-2">/</span>
                {index === pathSegments.length - 1 ? (
                  <span className="font-semibold">
                    {formatBreadcrumb(segment)}
                  </span>
                ) : (
                  <Link
                    href={`/${pathSegments.slice(0, index + 1).join("/")}`}
                    className="hover:text-gray-300 transition-colors"
                  >
                    {formatBreadcrumb(segment)}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-gray-700"
        >
          <User className="w-6 h-6" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
