
import { AlertCircle, X } from "lucide-react";

function ConfirmDialog({ isOpen, onClose, onConfirm, title }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3 text-blue-600">
              <AlertCircle size={24} />
            </div>

            <h2 id="dialog-title" className="text-lg font-bold text-slate-800">
              Confirm Submission
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-slate-400 hover:text-slate-700"
          >
            <X size={21} />
          </button>
        </div>

        <p className="text-slate-600 text-sm leading-6 mb-6">
          Are you sure you have submitted "{title}"?
          Once confirmed, your assignment status will change to Submitted.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-300 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Confirm Submission
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
