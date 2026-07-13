import type { Department } from '../../types/admin.types';

interface CreateOfficerViewProps {
  officerForm: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    department: Department;
  };

  setOfficerForm: React.Dispatch<React.SetStateAction<any>>;

  officerPhoto: File | null;
  setOfficerPhoto: React.Dispatch<React.SetStateAction<File | null>>;

  handleCreateOfficer: (e: React.FormEvent) => void;

  formLoading: boolean;
}

export default function CreateOfficerView({
  officerForm,
  setOfficerForm,
  officerPhoto,
  setOfficerPhoto,
  handleCreateOfficer,
  formLoading,
}: CreateOfficerViewProps) {
  return (
    <div className="w-full flex justify-center px-3 sm:px-4">
      <div className="w-full max-w-2xl">
        <div className="bg-[#0d1120] border border-white/5 rounded-xl p-4 sm:p-6">

          <h2 className="text-base font-semibold text-white mb-5">
            New Officer Account
          </h2>

          <form onSubmit={handleCreateOfficer} className="space-y-4">

            {/* First + Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  maxLength={50}
                  value={officerForm.firstName}
                  onChange={(e) =>
                    setOfficerForm((f) => ({
                      ...f,
                      firstName: e.target.value,
                    }))
                  }
                  className="w-full bg-[#0a0e1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50"
                  placeholder="Jane"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  maxLength={50}
                  value={officerForm.lastName}
                  onChange={(e) =>
                    setOfficerForm((f) => ({
                      ...f,
                      lastName: e.target.value,
                    }))
                  }
                  className="w-full bg-[#0a0e1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50"
                  placeholder="Smith"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={officerForm.email}
                onChange={(e) =>
                  setOfficerForm((f) => ({ ...f, email: e.target.value }))
                }
                className="w-full bg-[#0a0e1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50"
                placeholder="officer@smartcity.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={officerForm.password}
                onChange={(e) =>
                  setOfficerForm((f) => ({
                    ...f,
                    password: e.target.value,
                  }))
                }
                className="w-full bg-[#0a0e1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50"
                placeholder="Min 8 chars, uppercase, number"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">
                Department
              </label>
              <select
                value={officerForm.department}
                onChange={(e) =>
                  setOfficerForm((f) => ({
                    ...f,
                    department: e.target.value as Department,
                  }))
                }
                className="w-full bg-[#0a0e1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50"
              >
                <option value="Police">Police</option>
                <option value="Fire Department">Fire Department</option>
              </select>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">
                Officer Photo{' '}
                <span className="text-gray-600">(jpg/png, max 5MB)</span>
              </label>

              <label className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full bg-[#0a0e1a] border border-dashed border-white/10 rounded-lg px-3 py-3 cursor-pointer hover:border-blue-500/30 transition-colors">
                <span className="text-blue-400 text-sm">📷</span>

                <span className="text-sm text-gray-500 truncate">
                  {officerPhoto ? officerPhoto.name : 'Choose photo…'}
                </span>

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) =>
                    setOfficerPhoto(e.target.files?.[0] ?? null)
                  }
                />
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={formLoading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {formLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating…
                </>
              ) : (
                'Create Officer'
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}