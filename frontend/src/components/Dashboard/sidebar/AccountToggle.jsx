import React from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { useSelector } from 'react-redux'

function AccountToggle() {
  const user = useSelector((state) => state.auth.user)
  console.log(user)

  console.log(user.profilePic)
  return (
    <div className='border-b mb-4 mt-8 pb-4 border-stone-300'>
      <button className='flex p-0.5 hover:bg-stone-200 rounded transition-colors 
      relative gap-2 w-full items-center'>
        <img src={user.profilPic === "default-profile.png" ? "/assets/default-profile.png" : user.profilePic} 
        className='size-9 rounded shrink-0 bg-violet-500 shadow'  />
        
        <div className='text-start '>
            <span className='text-sm font-bold block tracking-wider'>{user.fullName}</span>
            <span className='text-xs block text-stone-500'>{user.email}</span>
        </div>

        {/* ICON of UP DOWN */}
        <FiChevronDown className='absolute right-0.5 top-1/2 translate-y-[calc(-50%+4px)] text-xs' />
        <FiChevronUp className='absolute right-0.5 top-1/2 translate-y-[calc(-50%-4px)] text-xs' />

        
      </button>
    </div>
  )
}

export default AccountToggle
