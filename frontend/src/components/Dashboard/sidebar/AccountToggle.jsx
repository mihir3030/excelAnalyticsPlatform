import React from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

function AccountToggle() {
  return (
    <div className='border-b mb-4 mt-8 pb-4 border-stone-300'>
      <button className='flex p-0.5 hover:bg-stone-200 rounded transition-colors 
      relative gap-2 w-full items-center'>
        <img src="https://api.dicebear.com/9.x/notionists/svg" alt="avtar"
        className='size-9 rounded shrink-0 bg-violet-500 shadow'  />
        
        <div className='text-start '>
            <span className='text-sm font-bold block tracking-wider'>Mihir Dholakia</span>
            <span className='text-xs block text-stone-500'>mihir.dholakia777@gmail.com</span>
        </div>

        {/* ICON of UP DOWN */}
        <FiChevronDown className='absolute right-0.5 top-1/2 translate-y-[calc(-50%+4px)] text-xs' />
        <FiChevronUp className='absolute right-0.5 top-1/2 translate-y-[calc(-50%-4px)] text-xs' />

        
      </button>
    </div>
  )
}

export default AccountToggle
