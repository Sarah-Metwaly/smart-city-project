import { useState, useCallback } from 'react';
import { adminService } from '../services/admin.services';

import type {
  User,
  Pagination,
  ActiveView,
} from '../types/admin.types';

export function useAdminUsers(
  activeView: ActiveView,
  showToast: (msg: string, type: 'success' | 'error') => void,
) {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);

  const [userFilters, setUserFilters] = useState({
    role: '',
    search: '',
    page: 1,
    limit: 10,
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const effectiveRole =
        activeView === 'officers' ? 'officer' : userFilters.role;
      if (effectiveRole) params.set('role', effectiveRole);
      if (userFilters.search) params.set('search', userFilters.search);
      params.set('page', String(userFilters.page));
      params.set('limit', String(userFilters.limit));

      const res = await adminService.getUsers(params);
      const data = res.data.data ?? res.data;
      setUsers(data.users ?? []);
      setPagination(data.pagination ?? null);
    } catch {
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  }, [userFilters, activeView ]);

  const handleToggleUser = async (user: User) => {
    try {
      if (user.isActive) {
        await adminService.deactivateUser(user._id);
      } else {
        await adminService.activateUser(user._id);
      }

      showToast(
        `User ${user.isActive ? 'deactivated' : 'activated'} successfully`,
        'success',
      );
      fetchUsers();
    } catch {
      showToast('Action failed', 'error');
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
          await adminService.deleteUser(id);
          showToast('User permanently deleted', 'success');
          //setDeleteConfirm(null);
          //setSelectedUser(null);
          fetchUsers();
        } catch {
          showToast('Delete failed', 'error');
        }
  };

  return {
    users,
    pagination,
    userFilters,
    setUserFilters,
    loading,
    fetchUsers,
    handleToggleUser,
    handleDeleteUser,

  };
}
