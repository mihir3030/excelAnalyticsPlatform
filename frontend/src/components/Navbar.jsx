import { useEffect, useState } from 'react'
import { assets } from '../assets/assets.js'
import { Link, NavLink, useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate()
    const navLinks = [
        { name: "Home", path: "/" },
        { name: "About Us", path: "/about" },
        { name: "Contact Us", path: "/contact" }
    ]

    // if scrolled change color
    const [isScrolled, setIsScrolled] = useState(false)
    const [isOpenMenu, setIsOpenMenu] = useState(false)

    useEffect(() => {
        setIsScrolled(window.scrollY > 10)

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-7 py-4 md:px-16 lg:px-24 
            xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white backdrop-blur-lg" : ""}`}>

            {/* LOGO */}
            <Link to="/">
                <img src={assets.logo} alt="logo" className='h-10' />
            </Link>

            {/* Navigation Nav */}
            <div className={`md:flex items-center gap-8 font-semibold tracking-wider`}>
                {navLinks.map((link, index) => (

                    <NavLink
                        key={index}
                        to={link.path}
                        className={({ isActive }) =>
                            `group flex flex-col pb-1 border-b-2 transition-all duration-200
                            ${isScrolled ? 'text-gray-800' : 'text-white'} 
                            ${isActive ? 'border-pink-500 w-1/10' : 'border-transparent'}`
                        }
                    >
                        {link.name}
                    </NavLink>
                ))}

                {/* Login Button */}
                <button type='button' 
                className='bg-pink-400 text-white px-4 py-2 rounded-md cursor-pointer'
                onClick={() => navigate('/dashboard')}>Dashboard</button>
            </div>

        </nav>
    )
}

export default Navbar