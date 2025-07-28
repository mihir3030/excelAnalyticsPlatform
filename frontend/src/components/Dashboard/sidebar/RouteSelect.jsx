import React from 'react'
import { FiHome, FiPaperclip, FiUser } from 'react-icons/fi'

const Route = ({selected, Icon, title}) => {
    return (
        <button className={`flex items-center gap-2 w-full rounded px-2 py-1.5 text-sm 
        transition-[box-shadow,_background-color,_color]
        ${selected
            ? 'bg-white text-stone-950 shadow'
            : 'hover:bg-stone-200 bg-transparent text-stone-500 shadow-none'
        }`}>
            <Icon className={selected ? "text-violet-600" : ""} />
            <span>{title}</span>

        </button>
    )
}

function RouteSelect() {
  return (
    <div className='space-y-1'>
      <Route Icon={FiHome} selected={true} title="Dashboard" />
      <Route Icon={FiUser} selected={false} title="User" />
      <Route Icon={FiPaperclip} selected={false} title="Charts" />
      <Route Icon={FiHome} selected={false} title="Dashboard" />
    </div>
  )
}

export default RouteSelect
