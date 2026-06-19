interface DeleteUserModalProps {
  userId: string | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export default function DeleteUserModal({
  userId,
  onClose,
  onConfirm,
}: DeleteUserModalProps) {
  if (!userId) return null;

  return (
    <>
      {userId && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => onClose}
        >
          <div
            className="bg-[#0d1120] border border-red-500/20 rounded-2xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-2xl">
                ⚠️
              </div>
              <h3 className="text-white font-semibold mb-2">
                Permanently Delete User?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                This action cannot be undone. The user will be permanently
                removed from the database.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2 text-sm rounded-lg border border-white/10 text-gray-400 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onConfirm(userId)}
                  className="flex-1 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
