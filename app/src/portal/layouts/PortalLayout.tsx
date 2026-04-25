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
      <SidebarInset className="min-h-svh overflow-hidden">
        <PortalHeader />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </SidebarInset>
      <CommandPalette />
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  );
}
