import { type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Удалить',
  cancelLabel = 'Отмена',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-pearl-50 p-6 shadow-2xl animate-scale-in">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-lg font-semibold text-ink-900">{title}</h2>
            <p className="text-sm text-ink-600">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" size="md" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button type="button" variant="primary" size="md" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

interface ModalShellProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function ModalShell({ open, onClose, title, children, footer }: ModalShellProps) {
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[150] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-pearl-50 shadow-2xl animate-scale-in sm:rounded-3xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-ink-200/60 bg-pearl-50/95 px-5 py-4 backdrop-blur sm:px-6">
          <h2 className="font-display text-lg font-semibold text-ink-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-600 hover:bg-ink-900/5"
            aria-label="Закрыть"
          >
            <span aria-hidden>✕</span>
          </button>
        </div>
        <div className="px-5 py-5 sm:px-6">{children}</div>
        {footer && (
          <div className="sticky bottom-0 border-t border-ink-200/60 bg-pearl-50/95 px-5 py-4 backdrop-blur sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
