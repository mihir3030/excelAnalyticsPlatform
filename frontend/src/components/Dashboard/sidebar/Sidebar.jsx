import AccountToggle from './AccountToggle'
import Search from './Search'
import RouteSelect from './RouteSelect'

function Sidebar({setIsOpen}) {
  return (
    <div>
        <div className='overflow-hidden  sticky top-4 h-[calc(100vh-32px-48px)]'>
             {/* TODO === Main SideBar Content */}
             <AccountToggle />
             <Search />
             <RouteSelect value={setIsOpen} />
        </div>

        {/* TODO === Plan Toogle */}
    </div>
  )
}

export default Sidebar
