import { FiHome, FiPaperclip, FiUser } from 'react-icons/fi'
import { useNavigate, useLocation } from 'react-router-dom'

const Route = ({selected, Icon, title, navigateTo, setIsOpen}) => {
  const navigate = useNavigate()
  const location = useLocation()

  const isSelected = location.pathname == navigateTo;

    return (
        <button 
        type='submit'
        onClick={() => {
          if(navigateTo){
            navigate(navigateTo);
            
          }
        }}
        className={`flex items-center gap-2 w-full rounded px-2 py-1.5 text-sm cursor-pointer
        transition-[box-shadow,_background-color,_color]
        ${isSelected
            ? 'bg-white text-stone-950 shadow'
            : 'hover:bg-stone-200 bg-transparent text-stone-500 shadow-none'
        }`}>
            <Icon className={isSelected ? "text-violet-600" : ""} />
            <span>{title}</span>
            
        </button>
    )
}

function RouteSelect({ setIsOpen }) {
  return (
    <div className='space-y-1'>
      <Route Icon={FiHome} selected={true} title="Dashboard" navigateTo="/dashboard" setIsOpen={setIsOpen} />
      <Route Icon={FiUser} selected={false} title="User" navigateTo="/dashboard/user-Info" setIsOpen={setIsOpen} />
      <Route Icon={FiPaperclip} selected={false} title="Charts" setIsOpen={setIsOpen} />
      <Route Icon={FiHome} selected={false} title="Logout" navigateTo="/logout" setIsOpen={setIsOpen} />
    </div>
  )
}

export default RouteSelect
