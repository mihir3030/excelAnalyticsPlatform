import React, { useState } from 'react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { Outlet } from 'react-router-dom'

export default function AdminDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header with proper spacing for menu button */}
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 pl-20">
          <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
        </div>
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  )
}