import { useState, useEffect } from 'react'
import Sidebar from '../components/Dashboard/sidebar/Sidebar'
import { Outlet, useLocation } from 'react-router-dom'

function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if(window.innerWidth < 768){
      setIsOpen(false)
    }
  }, [location.pathname])

  return (
    <div className="h-screen overflow-hidden flex md:grid md:grid-cols-[230px_1fr]">

      {/* Toggle button - small screens only */}
      {!isOpen && (<button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded shadow"
        onClick={() => setIsOpen(true)}
      >
        ☰
      </button>)  }

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[230px] bg-stone-100 pl-3 z-40 transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:h-full`}
      >
        {/* Close button - small screens only */}
        <div className="md:hidden flex justify-end p-2 border-b">
          <button onClick={() => setIsOpen(false)}>✖</button>
        </div>

        <Sidebar value={setIsOpen} />
      </aside>

      {/* Scrollable dashboard content */}
      <main className="overflow-y-auto h-full w-full p-4 bg-stone-100" onClick={() => setIsOpen(false)}>
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardPage
