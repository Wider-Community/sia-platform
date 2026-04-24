import { Refine, Authenticated } from "@refinedev/core";
import routerProvider from "@refinedev/react-router";
import { Outlet, Navigate } from "react-router-dom";
import { Building2, FileSignature, CheckSquare, Settings } from "lucide-react";
import {
  mockDataProvider,
  mockAuthProvider,
  notificationProvider,
  i18nProvider,
} from "./providers";
import { PortalLayout } from "./layouts/PortalLayout";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

const dataProvider = USE_MOCK
  ? mockDataProvider
  : // Dynamic import would go here for real provider
    mockDataProvider;

const authProviderInstance = USE_MOCK
  ? mockAuthProvider
  : // Real auth provider would go here
    mockAuthProvider;

export function PortalApp() {
  return (
    <Refine
      routerProvider={routerProvider}
      dataProvider={dataProvider}
      authProvider={authProviderInstance}
      notificationProvider={notificationProvider}
      i18nProvider={i18nProvider}
      resources={[
        {
          name: "organizations",
          list: "/portal/organizations",
          create: "/portal/organizations/create",
          edit: "/portal/organizations/edit/:id",
          show: "/portal/organizations/:id",
          meta: { label: "Organizations", icon: <Building2 /> },
        },
        {
          name: "signing-requests",
          list: "/portal/signing",
          create: "/portal/signing/new",
          show: "/portal/signing/:id",
          meta: { label: "Documents", icon: <FileSignature /> },
        },
        { name: "signature-fields", meta: { hide: true } },
        { name: "signers", meta: { hide: true } },
        { name: "contacts", meta: { hide: true } },
        { name: "files", meta: { hide: true } },
        { name: "notes", meta: { hide: true } },
        { name: "activity-events", meta: { hide: true } },
        { name: "users", meta: { hide: true } },
        {
          name: "tasks",
          list: "/portal/tasks",
          create: "/portal/tasks/create",
          meta: { label: "Tasks", icon: <CheckSquare /> },
        },
        { name: "sla-rules", meta: { hide: true } },
        { name: "alerts", meta: { hide: true } },
      ]}
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
      }}
    >
      <Outlet />
    </Refine>
  );
}

export function PortalAuthenticated() {
  return (
    <Authenticated
      key="portal-auth"
      fallback={<Navigate to="/portal/login" />}
    >
      <PortalLayout />
    </Authenticated>
  );
}
