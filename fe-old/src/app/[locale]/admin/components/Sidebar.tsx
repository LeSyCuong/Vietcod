"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGauge,
  faCogs,
  faBars,
  faUsers,
  faBoxOpen,
  faEnvelope,
  faMailBulk,
  faRobot,
  faBrain,
  faHistory,
  faChevronDown,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

interface SidebarProps {
  locale: string;
}

interface MenuItem {
  name: string;
  icon?: any;
  path: string;
  children?: MenuItem[];
}

export default function Sidebar({ locale }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const currentPath = usePathname() || "/";
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const createPath = (path: string) => `/${locale}${path}`;

  const checkActive = (menuPath: string) => {
    const normalizedCurrent = currentPath.replace(
      new RegExp(`^/${locale}`),
      ""
    );
    const normalizedMenu = menuPath.replace(new RegExp(`^/${locale}`), "");
    if (!normalizedMenu) return false;
    if (normalizedCurrent === normalizedMenu) return true;
    if (
      normalizedCurrent.startsWith(normalizedMenu + "/") &&
      normalizedMenu !== "/dashboard"
    ) {
      return true;
    }
    return false;
  };

  const menuItems: MenuItem[] = [
    {
      name: "Tổng quan",
      icon: faGauge,
      path: "/admin/dashboard",
    },
    {
      name: "Cấu hình",
      icon: faCogs,
      path: "/admin/config?page=config",
    },
    {
      name: "Quản lý",
      icon: faUsers,
      path: "#",
      children: [
        { name: "User", icon: faUsers, path: "/admin/user" },
        { name: "Sản phẩm", icon: faBoxOpen, path: "/admin/products" },
      ],
    },
    {
      name: "Liên hệ",
      icon: faEnvelope,
      path: "#",
      children: [
        { name: "Contact", icon: faEnvelope, path: "/admin/contact" },
        {
          name: "Sub email",
          icon: faMailBulk,
          path: "/admin/contact/subemail",
        },
      ],
    },
    {
      name: "Chatbot",
      icon: faRobot,
      path: "/dashboard/pages/chatbot",
      children: [
        { name: "Training", icon: faBrain, path: "/admin/chatbot/training" },
        { name: "History", icon: faHistory, path: "/admin/chatbot/history" },
      ],
    },
  ].map((item) => {
    if (item.children) {
      return {
        ...item,
        path: createPath(item.path),
        children: item.children.map((child) => ({
          ...child,
          path: createPath(child.path),
        })),
      };
    }
    return {
      ...item,
      path: createPath(item.path),
    };
  });

  return (
    <div className="flex min-h-screen ">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-white border-r border-gray-200 shadow-sm p-3 transition-all duration-300
  ${collapsed ? "w-16" : "w-50"} h-full overflow-y-auto`}
      >
        <div className="flex justify-center">
          <button
            className="w-full cursor-pointer px-2 py-3 rounded-lg hover:bg-blue-50 transition flex justify-center"
            onClick={() => setCollapsed(!collapsed)}
          >
            <FontAwesomeIcon icon={collapsed ? faBars : faChevronLeft} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-2 overflow-y-auto pb-20">
          {menuItems.map((item) => {
            const isActive = checkActive(item.path);
            const isOpen = openMenus[item.name] || false;

            return (
              <div key={item.name} className="transition-all">
                {item.children ? (
                  <div
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-500"
                        : "hover:bg-blue-50 text-gray-700 font-medium"
                    }`}
                    onClick={() => toggleMenu(item.name)}
                  >
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={item.icon} className="w-4" />
                      {!collapsed && item.name}
                    </div>
                    {!collapsed && (
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`w-3 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.path}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "hover:bg-blue-50 text-gray-700 font-medium"
                    }`}
                  >
                    <FontAwesomeIcon icon={item.icon} className="w-4" />
                    {!collapsed && item.name}
                  </Link>
                )}

                {/* Menu con */}
                {item.children && !collapsed && (
                  <div
                    className={`ml-6 mt-2 space-y-1 overflow-hidden transition-all duration-300 ${
                      isOpen
                        ? "max-h-[1000px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        href={child.path}
                        className={`block p-2 rounded-md text-sm transition-colors ${
                          checkActive(child.path)
                            ? "bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-500"
                            : "hover:bg-blue-50 text-gray-600"
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
