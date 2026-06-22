import { useState, useCallback } from 'react';
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
  // UI STATE ONLY
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    msg: string;
    type: 'success' | 'error';
  } | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // 🔥 USERS (React Query owns fetching)
  const {
    users,
    pagination,
    userFilters,
    setUserFilters,
    loading,
    handleToggleUser,
    isTogglingUser,
    handleDeleteUser,
    isDeletingUser,
  } = useAdminUsers(activeView);

  // 🔥 INCIDENTS (React Query owns fetching)
  const { incidents, incidentFilters, setIncidentFilters, incidentsLoading } =
    useAdminIncidents(showToast);

  // 🔥 CREATE OFFICER
  const {
    officerForm,
    setOfficerForm,
    officerPhoto,
    setOfficerPhoto,
    formLoading,
    handleCreateOfficer,
  } = useCreateOfficer(showToast, () => setActiveView('officers'));

  // DELETE WRAPPER (UI ONLY)
  const handleDeleteConfirm = async (id: string) => {
    await handleDeleteUser(id);
    setDeleteConfirm(null);
    setSelectedUser(null);
  };

  return (
    <div className="flex h-screen bg-[#0a0e1a] text-gray-100 font-sans overflow-hidden">
      {/* SIDEBAR */}
      <DashboardSidebar
        activeView={activeView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setActiveView={setActiveView}
      />

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          activeView={activeView}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex-1 overflow-y-auto p-6">
          {/* OVERVIEW */}
          {activeView === 'overview' && (
            <div className="space-y-6">
              <OverviewView users={users} incidents={incidents} />

              <div className="grid md:grid-cols-2 gap-4">
                <RecentUsersWidget users={users} />
                <RecentIncidentsWidget incidents={incidents} />
              </div>
            </div>
          )}

          {/* USERS / OFFICERS */}
          {(activeView === 'users' || activeView === 'officers') && (
            <UsersView
              users={users}
              loading={loading}
              activeView={activeView}
              userFilters={userFilters}
              setUserFilters={setUserFilters}
              pagination={pagination}
              onSelectUser={setSelectedUser}
              onToggleUser={handleToggleUser}
              onDeleteUser={setDeleteConfirm}
            />
          )}

          {/* INCIDENTS */}
          {activeView === 'incidents' && (
            <IncidentsView
              incidents={incidents}
              loading={incidentsLoading}
              incidentFilters={incidentFilters}
              setIncidentFilters={setIncidentFilters}
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

      {/* MODALS */}
      <UserDetailsModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onToggleUser={handleToggleUser}
        onDelete={setDeleteConfirm}
      />

      <DeleteUserModal
        userId={deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteConfirm}
        loading={isDeletingUser}
      />

      {/* TOAST */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 
    px-4 py-3 rounded-xl text-sm font-medium shadow-xl z-50 flex items-center gap-2
    animate-fade-in
    ${
      toast.type === 'success'
        ? 'bg-emerald-500/15 border border-emerald-500/20 text-emerald-400'
        : 'bg-red-500/15 border border-red-500/20 text-red-400'
    }`}
        >
          <span className="flex-shrink-0">
            {toast.type === 'success' ? '✓' : '✕'}
          </span>

          <span className="truncate">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
