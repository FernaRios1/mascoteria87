// File: src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const loc = useLocation()
  if (loading) return <p className="text-center">Cargando…</p>
  if (!user) return <Navigate to="/login" replace state={{ from: loc }} />
  return <Outlet />
}