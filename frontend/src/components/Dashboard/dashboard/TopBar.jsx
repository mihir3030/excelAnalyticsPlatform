import { FiCalendar } from 'react-icons/fi'
import { useSelector } from 'react-redux'

function TopBar() {
  const user = useSelector((state) => state.auth.user)

  // format date
  const today = new Date()
  const formateDate = today.toLocaleDateString("en-us", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  })

  return (
    <div className='border-b px-4 mb-4 mt-2 pt-2 pb-4 border-stone-200'>
      {/* Container to align left & right */}
      <div className='flex items-start justify-between'>
        {/* Left: Greeting + Date */}
        <div className='p-0.5'>
          <span className='text-sm font-bold block'>
            🚀 Welcome {user.fullname}!
          </span>
          <span className='text-xs block text-stone-500'>
            {formateDate}
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
