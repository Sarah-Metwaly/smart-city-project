import type { Incident } from '../../types/admin.types';
import {
  INCIDENT_ICON,
  PRIORITY_COLOR,
  STATUS_COLOR,
} from '../../constants/admin.constants';

interface IncidentsViewProps {
  incidents: Incident[];
  loading: boolean;

  incidentFilters: any;
  setIncidentFilters: React.Dispatch<React.SetStateAction<any>>;

  fetchIncidents: () => void;
}

export default function IncidentsView({
  incidents,
  loading,
  incidentFilters,
  setIncidentFilters,
  fetchIncidents,
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
          <option value="INTRUSION_DETECTION">Intrusion Detection</option>
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
          <option value="PENDING">Pending</option>
          <option value="RESOLVED">Resolved</option>
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

        <button
          onClick={fetchIncidents}
          className="px-4 py-2 bg-blue-500/15 border border-blue-500/20 text-blue-400 rounded-lg text-sm"
        >
          Apply Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#0d1120] border border-white/5 rounded-xl overflow-hidden">
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
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span>{INCIDENT_ICON[inc.type] ?? '⚠️'}</span>
                      <span className="text-gray-300 text-xs">
                        {inc.type.replace(/_/g, ' ')}
                      </span>
                    </div>
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
              {incidents.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-gray-600 text-sm"
                  >
                    No incidents match the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
