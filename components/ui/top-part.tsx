import { Search, Bell } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "./sidebar";

export default function TopPart() {
  return (
    <div className="w-full flex items-center justify-between px-4 py-2 border-b">
      <div className="flex gap-2">
        <SidebarTrigger />
        <div className="relative  w-[350px]">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search"
            className="pl-8 h-7 bg-[#E1E8ED] focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            2
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
            <Image src="/man.jpg" alt="User avatar" width={32} height={32} />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium">Fita Wegene</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
