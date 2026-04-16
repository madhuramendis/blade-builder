"use client";
import { useCallback, useState } from "react";
import { Alert, Snackbar } from "@wso2/oxygen-ui";

export type ToastType = "default" | "warn" | "error";

interface ToastState {
  msg:     string;
  type:    ToastType;
  visible: boolean;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({ msg: "", type: "default", visible: false });

  const showToast = useCallback((msg: string, type: ToastType = "default") => {
    setToast({ msg, type, visible: true });
  }, []);

  const closeToast = useCallback(() => {
    setToast(p => ({ ...p, visible: false }));
  }, []);

  return { toast, showToast, closeToast };
}

const severityMap = { default: "success", warn: "warning", error: "error" } as const;

export function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  return (
    <Snackbar
      open={toast.visible}
      autoHideDuration={2800}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={severityMap[toast.type]} variant="filled" sx={{ width: "100%" }}>
        {toast.msg}
      </Alert>
    </Snackbar>
  );
}
