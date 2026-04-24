import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { PortalSidebar } from "../components/PortalSidebar";
import { PortalHeader } from "../components/PortalHeader";
import { CommandPalette } from "../components/CommandPalette";

export function PortalLayout() {
  return (
    <SidebarProvider>
      <PortalSidebar />
      <SidebarInset>
        <PortalHeader />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </SidebarInset>
      <CommandPalette />
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  );
}
