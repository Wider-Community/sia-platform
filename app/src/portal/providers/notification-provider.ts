import type { NotificationProvider } from "@refinedev/core";
import { toast } from "sonner";

export const notificationProvider: NotificationProvider = {
  open({ message, type, description, key }) {
    const opts = { description, id: key };
    if (type === "success") toast.success(message, opts);
    else if (type === "error") toast.error(message, opts);
    else if (type === "progress") toast.loading(message, opts);
    else toast(message, opts);
  },
  close(key) {
    toast.dismiss(key);
  },
};
