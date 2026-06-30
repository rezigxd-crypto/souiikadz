import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminDashboard from '../components/dashboard/AdminDashboard'
import FarmerDashboard from '../components/dashboard/FarmerDashboard'
import ClientDashboard from '../components/dashboard/ClientDashboard'

export default function DashboardPage() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/auth" replace />
  return (
    <div className="min-h-screen pt-16 bg-brand-50/40 flex" style={{ direction: 'rtl' }}>
      {user.role === 'admin'    && <AdminDashboard />}
      {user.role === 'farmer'   && <FarmerDashboard />}
      {user.role === 'consumer' && <ClientDashboard />}
    </div>
  )
}
