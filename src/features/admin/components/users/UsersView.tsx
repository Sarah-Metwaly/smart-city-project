import type { User, ActiveView } from '../../types/admin.types';
import UsersTable from './UsersTable';

interface UsersViewProps {
  users: User[];
  loading: boolean;
  activeView: ActiveView;

  userFilters: any;
  setUserFilters: React.Dispatch<React.SetStateAction<any>>;
  pagination: any;

  onSelectUser: (user: User) => void;
  onToggleUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
}

export default function UsersView({
  users,
  loading,
  activeView,

  userFilters,
  setUserFilters,
  pagination,

  onSelectUser,
  onToggleUser,
  onDeleteUser,
}: UsersViewProps) {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by name..."
          value={userFilters?.search ?? ''}
          onChange={(e) =>
            setUserFilters((f: any) => ({
              ...f,
              search: e.target.value,
              page: 1,
            }))
          }
          className="
            w-full sm:w-64
            bg-[#0d1120]
            border border-white/10
            rounded-lg
            px-3 py-2
            text-sm text-gray-200
            placeholder-gray-600
            focus:outline-none
            focus:border-blue-500/50
          "
        />

        {activeView === 'users' && (
          <select
            value={userFilters?.role ?? ''}
            onChange={(e) =>
              setUserFilters((f: any) => ({
                ...f,
                role: e.target.value,
                page: 1,
              }))
            }
            className="
              w-full sm:w-auto
              bg-[#0d1120]
              border border-white/10
              rounded-lg
              px-3 py-2
              text-sm text-gray-200
              focus:outline-none
              focus:border-blue-500/50
            "
          >
            <option value="">All Roles</option>
            <option value="citizen">Citizen</option>
            <option value="officer">Officer</option>
            <option value="admin">Admin</option>
          </select>
        )}
      </div>

      <UsersTable
        users={users}
        loading={loading}
        activeView={activeView}
        onSelectUser={onSelectUser}
        onToggleUser={onToggleUser}
        onDeleteUser={onDeleteUser}
      />

      {/* Pagination */}
      {pagination && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-500">
          <span className="text-center sm:text-left">
            Showing {(pagination.page - 1) * pagination.limit + 1}–
            {Math.min(
              pagination.page * pagination.limit,
              pagination.total
            )}{' '}
            of {pagination.total}
          </span>

          <div className="flex justify-center sm:justify-end gap-2">
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() =>
                setUserFilters((f) => ({
                  ...f,
                  page: f.page - 1,
                }))
              }
              className="
                px-3 py-1.5
                bg-[#0d1120]
                border border-white/10
                rounded-lg
                disabled:opacity-30
                hover:border-blue-500/30
                transition-colors
              "
            >
              ←
            </button>

            <button
              disabled={!pagination.hasNextPage}
              onClick={() =>
                setUserFilters((f) => ({
                  ...f,
                  page: f.page + 1,
                }))
              }
              className="
                px-3 py-1.5
                bg-[#0d1120]
                border border-white/10
                rounded-lg
                disabled:opacity-30
                hover:border-blue-500/30
                transition-colors
              "
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}