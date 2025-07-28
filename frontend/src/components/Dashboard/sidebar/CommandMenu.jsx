import { Command } from 'cmdk'
import { useEffect, useState } from 'react'
import { FiEye, FiPlus } from 'react-icons/fi'

const CommandMenu = ({open, setOpen}) => {
    const [value, setValue] = useState('')

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <Command.Dialog open={open} 
    onOpenChange={setOpen} 
    label="Global Command Menu"
    className='fixed inset-0 bg-stone-950/50'
    onClick={() => setOpen(false)}>

      <div onClick={(e) => e.stopPropagation()}
        className='bg-white rounded-lg shadow-xl border-stone-300 border overflow-hidden w-full
        max-w-lg mx-auto mt-12'>

      <Command.Input 
      value={value}
      onValueChange={setValue}
      placeholder='What You Need?'
      className='relative border-b border-stone-300 px-3 text-lg w-full 
      placeholder:text-stone-400 focus:outline-none py-3' />
      
      <Command.List>
        <Command.Empty>
            <span className='text-violet-500'>{value}</span>
        </Command.Empty>

        <Command.Group heading="Team" className='text-sm mb-3 text-stion-400 p-3 text-stone-400'>
          
          <Command.Item className='flex cursor-pointer transition-colors p-2 text-sm text-stone-900
          hover:bg-stone-200 rounded items-center gap-2'>
            <FiPlus />
            Invite A New Member
          </Command.Item>

          <Command.Item className='flex cursor-pointer transition-colors p-2 text-sm text-stone-900
          hover:bg-stone-200 rounded items-center gap-2'>
            <FiEye />
            See Charts
          </Command.Item>

        </Command.Group>
      </Command.List>
      </div>
    </Command.Dialog>
  )
}

export default CommandMenu