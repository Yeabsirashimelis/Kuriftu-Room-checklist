"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Bed,
} from "lucide-react";

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("Form Generator");

  const menuItems = [
    { name: "dashboard", icon: LayoutDashboard },
    { name: "form-generator", icon: FileText },
    { name: "form-management", icon: FileText },
    { name: "rooms", icon: Bed },
  ];

  const bottomMenuItems = [
    { name: "Settings", icon: Settings },
    { name: "Logout", icon: LogOut },
  ];

  return (
    <div className="w-[300px] h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Link href="/" className="flex items-center">
          <img src="/images/logo.svg" className="h-8 w-8 text-blue-500" />
          <span className="ml-1 text-2xl font-semibold text-blue-500">
            House Keeping Management
          </span>
        </Link>
      </div>

      <div className="flex-1 py-6 px-4 space-y-1 text-sm">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.name;

          return (
            <Link
              key={item.name}
              href={item.name === "dashboard" ? "/" : `/${item.name}`}
              onClick={() => setActiveItem(item.name)}
              className={`flex items-center px-4 py-2 rounded-md ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="ml-3">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 space-y-1">
        {bottomMenuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href="#"
              className="flex items-center px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 text-sm"
            >
              <Icon className="h-5 w-5" />
              <span className="ml-3">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
