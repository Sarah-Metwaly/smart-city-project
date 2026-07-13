interface DeleteUserModalProps {
  userId: string | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
  loading: boolean;
}

export default function DeleteUserModal({
  userId,
  onClose,
  onConfirm,
  loading,
}: DeleteUserModalProps) {
  if (!userId) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0d1120] border border-red-500/20 rounded-2xl p-5 sm:p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-xl sm:text-2xl">
            ⚠️
          </div>

          <h3 className="text-white font-semibold mb-2 text-base sm:text-lg">
            Permanently Delete User?
          </h3>

          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            This action cannot be undone. The user will be permanently removed
            from the database.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 text-sm rounded-lg border border-white/10 text-gray-400 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={() => onConfirm(userId)}
              disabled={loading}
              className="flex-1 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Forever'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}