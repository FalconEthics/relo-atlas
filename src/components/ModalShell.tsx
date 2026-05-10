import type { ReactNode } from "react";

type ModalShellProps = {
  open: boolean;
  onClose: () => void;
  maxWidth: number;
  children: ReactNode;
  zIndex?: number;
};

export function ModalShell({
  open,
  onClose,
  maxWidth,
  children,
  zIndex = 2000,
}: ModalShellProps) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.92)",
        zIndex,
        overflowY: "auto",
        padding: "24px 16px",
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          background: "#0f0f26",
          borderRadius: 12,
          maxWidth,
          width: "100%",
          margin: "0 auto",
          border: "1px solid #2a2a4a",
          padding: "28px 32px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
