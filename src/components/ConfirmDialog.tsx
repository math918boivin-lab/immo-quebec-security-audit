"use client";

import { Modal } from "./Modal";
import { DangerButton, SecondaryButton } from "./form";

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="text-sm text-slate-600">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <SecondaryButton onClick={onCancel}>Annuler</SecondaryButton>
        <DangerButton onClick={onConfirm}>Supprimer</DangerButton>
      </div>
    </Modal>
  );
}
