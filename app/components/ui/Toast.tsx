// components/ui/Toast.tsx
"use client";
import { useEffect, useState, useCallback } from "react";

export type ToastType = "default" | "warn" | "error";

interface ToastState {
  msg: string;
  type: ToastType;
  visible: boolean;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({ msg: "", type: "default", visible: false });

  const showToast = useCallback((msg: string, type: ToastType = "default") => {
    setToast({ msg, type, visible: true });
  }, []);

  useEffect(() => {
    if (!toast.visible) return;
    const t = setTimeout(() => setToast((p) => ({ ...p, visible: false })), 2800);
    return () => clearTimeout(t);
  }, [toast.visible, toast.msg]);

  return { toast, showToast };
}

export function Toast({ toast }: { toast: ToastState }) {
  return (
    <div
      className={`toast toast-${toast.type}${toast.visible ? " show" : ""}`}
    >
      {toast.msg}
    </div>
  );
}
