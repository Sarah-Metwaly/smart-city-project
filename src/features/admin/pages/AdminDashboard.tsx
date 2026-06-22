import { useState, useEffect, useCallback } from 'react';
import DashboardSidebar from '../components/layout/DashboardSidebar';
import DashboardHeader from '../components/layout/DashboardHeader';
import UserDetailsModal from '../components/modals/UserDetailsModal';
import DeleteUserModal from '../components/modals/DeleteUserModal';
import UsersView from '../components/users/UsersView';
import OverviewView from '../components/overview/OverviewView';
import RecentUsersWidget from '../components/overview/RecentUsersWidget';
import RecentIncidentsWidget from '../components/overview/RecentIncidentsWidget';
import IncidentsView from '../components/incidents/IncidentsView';
import CreateOfficerView from '../components/officers/CreateOfficersView';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { useAdminIncidents } from '../hooks/useAdminIncidents';
import { useCreateOfficer } from '../hooks/useCreateOfficers';

import type { User, ActiveView, Department } from '../types/admin.types';

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [toast, setToast] = useState<{
    msg: string;
    type: 'success' | 'error';
  } | null>(null);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const showToast = useCallback((msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  const {
    users,
    pagination,
    userFilters,
    setUserFilters,
    loading,
    fetchUsers,
    handleToggleUser,
    handleDeleteUser,
  } = useAdminUsers(activeView, showToast);

  const {
    incidents,
    incidentFilters,
    setIncidentFilters,
    incidentsLoading,
    fetchIncidents,
  } = useAdminIncidents(showToast);

  const {
    officerForm,
    setOfficerForm,
    officerPhoto,
    setOfficerPhoto,
    formLoading,
    handleCreateOfficer,
  } = useCreateOfficer(showToast, () => {
    setActiveView('officers');
  });

  const handleDeleteConfirm = async (id: string) => {
    const success = await handleDeleteUser(id);

    if (success) {
      setDeleteConfirm(null);
      setSelectedUser(null);
    }
  };

  useEffect(() => {
    if (activeView === 'users' || activeView === 'officers') fetchUsers();
  }, [activeView, fetchUsers]);

  useEffect(() => {
    if (activeView === 'incidents') fetchIncidents();
  }, [activeView, fetchIncidents]);

  useEffect(() => {
    if (activeView === 'overview') {
      fetchUsers();
      fetchIncidents();
    }
  }, [activeView, fetchUsers, fetchIncidents]);

  return (
    <div className="flex h-screen bg-[#0a0e1a] text-gray-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar
        activeView={activeView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setActiveView={setActiveView}
      />

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <DashboardHeader activeView={activeView} />

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* OVERVIEW */}
          {activeView === 'overview' && (
            <div className="space-y-6">
              <OverviewView users={users} incidents={incidents} />

              <div className="grid md:grid-cols-2 gap-4">
                {/* Recent Users */}
                <RecentUsersWidget users={users} />

                {/* Recent Incidents */}
                <RecentIncidentsWidget incidents={incidents} />
              </div>
            </div>
          )}

          {/* USERS / OFFICERS */}
          {(activeView === 'users' || activeView === 'officers') && (
            <div className="space-y-4">
              {/* userView */}
              <UsersView
                users={users}
                loading={loading}
                activeView={activeView}
                userFilters={userFilters}
                setUserFilters={setUserFilters}
                pagination={pagination}
                fetchUsers={fetchUsers}
                onSelectUser={setSelectedUser}
                onToggleUser={handleToggleUser}
                onDeleteUser={setDeleteConfirm}
              />
            </div>
          )}

          {/* INCIDENTS */}
          {activeView === 'incidents' && (
            <IncidentsView
              incidents={incidents}
              loading={incidentsLoading}
              incidentFilters={incidentFilters}
              setIncidentFilters={setIncidentFilters}
              fetchIncidents={fetchIncidents}
            />
          )}

          {/* CREATE OFFICER */}
          {activeView === 'create-officer' && (
            <CreateOfficerView
              officerForm={officerForm}
              setOfficerForm={setOfficerForm}
              officerPhoto={officerPhoto}
              setOfficerPhoto={setOfficerPhoto}
              handleCreateOfficer={handleCreateOfficer}
              formLoading={formLoading}
            />
          )}
        </div>
      </main>

      {/* User Detail Modal */}
      <UserDetailsModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onToggleUser={handleToggleUser}
        onDelete={setDeleteConfirm}
      />

      {/* Delete Confirm Modal */}
      <DeleteUserModal
        userId={deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl text-sm font-medium shadow-xl z-50 flex items-center gap-2 ${
            toast.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/15 border border-red-500/20 text-red-400'
          }`}
        >
          <span>{toast.type === 'success' ? '✓' : '✕'}</span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
