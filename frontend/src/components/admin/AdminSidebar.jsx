import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { 
  FiHome, 
  FiUsers, 
  FiFileText, 
  FiBarChart2, 
  FiSettings,
  FiLogOut,
  FiUser,
  FiChevronRight,
  FiMenu,
  FiX
} from 'react-icons/fi'
import { logout } from '../../features/auth/authSlice'

function AdminSidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const [isMobile, setIsMobile] = useState(false)

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isOpen && !event.target.closest('.sidebar')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobile, isOpen, setIsOpen])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleNavClick = () => {
    // Close sidebar on mobile when nav item is clicked
    if (isMobile) {
      setIsOpen(false)
    }
  }

  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: FiHome,
      end: true
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: FiUsers,
      end: false
    },
  
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-opacity-50 z-40 md:hidden" />
      )}

      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-[60] p-3 bg-white rounded-lg shadow-lg border border-gray-200 md:hidden touch-manipulation"
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          {isOpen ? (
            <FiX className="w-6 h-6 text-gray-600" />
          ) : (
            <FiMenu className="w-6 h-6 text-gray-600" />
          )}
        </button>
      )}

      {/* Sidebar */}
      <div className={`
        sidebar
        fixed md:static
        top-0 left-0
        w-64 bg-white shadow-lg h-full
        flex flex-col
        z-50
        transition-transform duration-300 ease-in-out
        ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        md:translate-x-0
      `}>
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FiBarChart2 className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-gray-900">Excel Analytics</h1>
              <p className="text-sm text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Admin Profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FiUser className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                  {item.name}
                  {isActive && <FiChevronRight className="w-4 h-4 ml-auto text-blue-700" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              navigate('/dashboard')
              handleNavClick()
            }}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 mb-2"
          >
            <FiUser className="w-5 h-5 mr-3 text-gray-400" />
            Switch to User Panel
          </button>
          
          <button
            onClick={() => {
              handleLogout()
              handleNavClick()
            }}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
          >
            <FiLogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </>
  )
}

export default AdminSidebar