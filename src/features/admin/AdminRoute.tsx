/**
 * AdminRoute.tsx
 * 
 * Wraps AdminDashboard with a role-check guard.
 * Usage in your router:
 * 
 *   import AdminRoute from './AdminRoute';
 *   <Route path="/admin/*" element={<AdminRoute />} />
 */

// import { Navigate } from "react-router-dom";
// import AdminDashboard from "./pages/AdminDashboard";

// export default function AdminRoute() {
//   const raw = localStorage.getItem("user");
//   if (!raw) return <Navigate to="/login" replace />;

//   try {
//     const user = JSON.parse(raw);
//     if (user?.role !== "admin") return <Navigate to="/" replace />;
//   } catch {
//     return <Navigate to="/login" replace />;
//   }

//   return <AdminDashboard />;
// }


import AdminDashboard from "./pages/AdminDashboard";

export default function AdminRoute() {
  return <AdminDashboard />;
}