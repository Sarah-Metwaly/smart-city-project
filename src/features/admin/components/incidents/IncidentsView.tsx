import type { Incident } from '../../types/admin.types';
import { TbMapPin } from 'react-icons/tb';
import { PRIORITY_COLOR, STATUS_COLOR } from '../../constants/admin.constants';

interface IncidentsViewProps {
  incidents: Incident[];
  loading: boolean;

  incidentFilters: any;
  setIncidentFilters: React.Dispatch<React.SetStateAction<any>>;
}

export default function IncidentsView({
  incidents,
  loading,
  incidentFilters,
  setIncidentFilters,
}: IncidentsViewProps) {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={incidentFilters.type}
          onChange={(e) =>
            setIncidentFilters((f: any) => ({ ...f, type: e.target.value }))
          }
          className="bg-[#0d1120] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200"
        >
          <option value="">All Types</option>
          <option value="SMOKE_DETECTION">Smoke Detection</option>
          <option value="THEFT_DETECTION">Theft Detection</option>
          <option value="FIRE_DETECTION">Fire Detection</option>
          <option value="CROWD_MANAGEMENT">Crowd Management</option>
          <option value="MEDICAL_EMERGENCY">Medical Emergency</option>
          <option value="WEAPON_DETECTION">Weapon Detection</option>
        </select>

        <select
          value={incidentFilters.status}
          onChange={(e) =>
            setIncidentFilters((f: any) => ({ ...f, status: e.target.value }))
          }
          className="bg-[#0d1120] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="DISPATCHED">Dispatched</option>
          <option value="RESOLVED">Resolved</option>
          <option value="FALSE_ALARM">False Alarm</option>
          <option value="AI CLEARED-AWAITING CONFIRMATION">
            AI Cleared - Awaiting Confirmation
          </option>
        </select>

        <select
          value={incidentFilters.priority}
          onChange={(e) =>
            setIncidentFilters((f: any) => ({ ...f, priority: e.target.value }))
          }
          className="bg-[#0d1120] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200"
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      {/* Table */}
      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-white/5">
        {incidents.map((inc) => (
          <div key={inc._id} className="p-4 space-y-3">
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-blue-400 text-xs font-mono truncate">
                  {inc.incidentId}
                </p>

                <p className="text-gray-300 text-sm truncate">
                  {inc.type.replace(/_/g, ' ')}
                </p>
              </div>

              <span
                className={`text-xs px-2 py-1 rounded-full ${STATUS_COLOR[inc.status]}`}
              >
                {inc.status}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <span
                className={`text-xs px-2 py-1 rounded-full ${PRIORITY_COLOR[inc.priority]}`}
              >
                {inc.priority}
              </span>

              <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-400">
                {inc.source?.deviceId ?? 'No source'}
              </span>
            </div>

            {/* Location + Date */}
            {/* Location + Date */}
            <div className="text-xs text-gray-600 flex flex-col gap-1">

              <div className="flex items-center justify-between gap-2">
                <span className="truncate">
                  {new Date(inc.createdAt).toLocaleString()}
                </span>

                {inc.location?.name && (
                  <span className="text-gray-500 bg-white/5 px-2 py-0.5 rounded-md whitespace-nowrap">
                    {inc.location.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-[#0d1120] border border-white/5 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-wide">
                <th className="text-left px-4 py-3 font-medium">Incident ID</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Priority</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Location</th>
                <th className="text-left px-4 py-3 font-medium">Source</th>
                <th className="text-left px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {incidents.map((inc) => (
                <tr
                  key={inc._id}
                  className="hover:bg-white/2 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-blue-400">
                    {inc.incidentId}
                  </td>

                  <td className="px-4 py-3 text-gray-300 text-xs">
                    {inc.type.replace(/_/g, ' ')}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLOR[inc.priority]}`}
                    >
                      {inc.priority}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOR[inc.status]}`}
                    >
                      {inc.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {inc.location?.name ?? '—'}
                  </td>

                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {inc.source?.deviceId ?? '—'}
                  </td>

                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {new Date(inc.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
