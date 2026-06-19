import type { User, ActiveView } from '../../types/admin.types';
import type { Dispatch, SetStateAction } from 'react';
import UsersTable from './UsersTable';

interface UsersViewProps {
  users: User[];
  loading: boolean;
  activeView: ActiveView;

  userFilters: any;
  setUserFilters: React.Dispatch<React.SetStateAction<any>>;
  pagination: any;
  fetchUsers: () => void;

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
  fetchUsers,

  onSelectUser,
  onToggleUser,
  onDeleteUser,
}: UsersViewProps) {
  return (
    <div className="space-y-4">
      {/* filters*/}
      <div className="flex flex-wrap gap-3">
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
          className="bg-[#0d1120] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500/50 w-48"
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
            className="bg-[#0d1120] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50"
          >
            <option value="">All Roles</option>
            <option value="citizen">Citizen</option>
            <option value="officer">Officer</option>
            <option value="admin">Admin</option>
          </select>
        )}

        <button
          onClick={() => {
            if (activeView === 'officers') {
              setUserFilters((f: any) => ({
                ...f,
                role: 'officer',
                page: 1,
              }));
            }
            fetchUsers();
          }}
          className="px-4 py-2 bg-blue-500/15 border border-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/25 transition-colors"
        >
          Search
        </button>
      </div>

      <UsersTable
        users={users}
        loading={loading}
        activeView={activeView}
        onSelectUser={onSelectUser}
        onToggleUser={onToggleUser}
        onDeleteUser={onDeleteUser}
      />

      {/* {pagination} */}
      {pagination && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {(pagination.page - 1) * pagination.limit + 1}–
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total}
          </span>
          <div className="flex gap-2">
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() =>
                setUserFilters((f) => ({ ...f, page: f.page - 1 }))
              }
              className="px-3 py-1.5 bg-[#0d1120] border border-white/10 rounded-lg disabled:opacity-30 hover:border-blue-500/30 transition-colors"
            >
              ←
            </button>
            <button
              disabled={!pagination.hasNextPage}
              onClick={() =>
                setUserFilters((f) => ({ ...f, page: f.page + 1 }))
              }
              className="px-3 py-1.5 bg-[#0d1120] border border-white/10 rounded-lg disabled:opacity-30 hover:border-blue-500/30 transition-colors"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
