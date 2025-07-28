import React, { useState } from 'react'
import Sidebar from '../components/Dashboard/sidebar/Sidebar'
import Dashboard from '../components/Dashboard/dashboard/Dashboard'

function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="md:grid md:grid-cols-[230px_1fr] relative">

      {/* Toggle button - mobile only */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded shadow"
        onClick={() => setIsSidebarOpen(true)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-4 left-0 h-full w-[230px] z-40 shadow-md
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:shadow-none 
        `}
      >
        {/* Close button - mobile only */}
        <div className="md:hidden flex justify-end p-4 border-b">
          <button onClick={() => setIsSidebarOpen(false)}>✖</button>
        </div>

        <Sidebar />
      </aside>

      {/* Dashboard content */}
      <main className="p-4">
        <Dashboard />
      </main>
    </div>
  )
}

export default DashboardPage
