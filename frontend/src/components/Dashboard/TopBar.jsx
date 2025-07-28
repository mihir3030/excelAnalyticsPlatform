import React from 'react'
import { FiCalendar } from 'react-icons/fi'

function TopBar() {
  return (
    <div className='border-b px-4 mb-4 mt-2 pb-4 border-stone-200'>
      {/* Container to align left & right */}
      <div className='flex items-start justify-between'>
        {/* Left: Greeting + Date */}
        <div className='p-0.5'>
          <span className='text-sm font-bold block'>
            🚀 Good Morning Tom!
          </span>
          <span className='text-xs block text-stone-500'>
            Tuesday, August 26, 2025
          </span>
        </div>

        {/* Right: Previous Records Button */}
        <button className='flex text-sm items-center gap-2 bg-stone-100 transition-colors 
        hover:bg-violet-100 hover:text-violet-700 px-3 py-1.5 rounded'>
          <FiCalendar />
          <span>Previous Records</span>
        </button>
      </div>
    </div>
  )
}

export default TopBar
