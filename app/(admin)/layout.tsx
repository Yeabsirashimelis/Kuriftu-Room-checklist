import Sidebar from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import TopPart from "@/components/ui/top-part";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar />
      <div className="flex flex-col w-full">
        <TopPart />
        <main className="bg-white flex flex-1 flex-col p-2 transition-all duration-300 ease-in-out">
          <div className="h-full rounded-md  p-2">
            <div className="p-2">{children}</div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
