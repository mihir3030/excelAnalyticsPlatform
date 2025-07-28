import { useState } from 'react'
import { FiCommand, FiSearch } from 'react-icons/fi'
import CommandMenu from './CommandMenu'

function Search() {
    const [open, setOpen] = useState(false)
    
  return (
    <>
      <div className='bg-stone-200 mb-4 relative rounded flex items-center px-2 py-1.5 text-sm'>
        <FiSearch className='mr-2' />
        <input type='text' placeholder='Search'
        className='w-full bg-transparent placeholder:text-stone-500 focus:outline-none'
        onFocus={(e) => {e.target.blur(); setOpen(true)}} />

        <span className='p-1 text-sx flex gap-0.5 items-center shadow bg-stone-50 rounded
        absolute right-1.5 top-1/2 -translate-y-1/2'>
            <FiCommand /> K
        </span>
      </div>

      <CommandMenu open={open} setOpen={setOpen} />
    </>
  )
}

export default Search
