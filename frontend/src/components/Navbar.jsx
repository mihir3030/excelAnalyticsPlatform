import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { assets } from '../assets/assets.js'
import { useNavigate, useLocation } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Contact Us", path: "/contact" },
    ]

    const [isScrolled, setIsScrolled] = useState(false)
    const [isOpenMenu, setIsOpenMenu] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const closeMobileMenu = () => setIsOpenMenu(false)

    const handleNavigation = (path) => {
        navigate(path)
        closeMobileMenu()
    }

    useEffect(() => {
        document.body.style.overflow = isOpenMenu ? 'hidden' : 'unset'
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpenMenu])

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 md:px-16 lg:px-24 
                xl:px-32 transition-all duration-500 z-100 ${isScrolled ? "bg-white/95 backdrop-blur-lg shadow-lg" : "bg-transparent"}`}>

                {/* Logo */}
                <button onClick={() => handleNavigation('/')} className="focus:outline-none">
                    <div className={`text-2xl font-bold transition-colors duration-300 ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                        <img src={assets.logo} alt="Logo" />
                    </div>
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8 font-semibold tracking-wider">
                    {navLinks.map((link, index) => (
                        <button
                            key={index}
                            onClick={() => handleNavigation(link.path)}
                            className={`group flex flex-col pb-1 border-b-2 transition-all duration-300 hover:scale-105 focus:outline-none
                                ${isScrolled ? 'text-gray-800 hover:text-blue-600' : 'text-black hover:text-blue-500 font-bold'} 
                                ${location.pathname === link.path ? 'border-pink-500' : 'border-transparent'}`}
                        >
                            {link.name}
                        </button>
                    ))}

                    {/* Desktop Login Button */}
                    <button 
                        type='button' 
                        className='bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full cursor-pointer 
                                 hover:from-pink-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-300'
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className={`md:hidden p-2 rounded-lg transition-all duration-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 ${isScrolled ? 'text-gray-800' : 'text-white'}`}
                    onClick={() => setIsOpenMenu(!isOpenMenu)}
                    aria-label="Toggle mobile menu"
                >
                    <div className="relative w-6 h-6">
                        <Menu className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${isOpenMenu ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                        <X className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${isOpenMenu ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
                    </div>
                </button>
            </nav>

            {/* Mobile Overlay */}
            <div 
                className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ${
                    isOpenMenu ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`} 
                onClick={closeMobileMenu}
            ></div>

            {/* Mobile Menu */}
            <div className={`md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 
                           transform transition-transform duration-300 ease-in-out ${
                isOpenMenu ? 'translate-x-0' : 'translate-x-full'
            }`}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Excel Analytics
                    </div>
                    <button
                        onClick={closeMobileMenu}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        aria-label="Close mobile menu"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Mobile Links */}
                <div className="flex flex-col py-6">
                    {navLinks.map((link, index) => (
                        <button
                            key={index}
                            onClick={() => handleNavigation(link.path)}
                            className={`px-6 py-4 text-lg font-semibold transition-all duration-200 border-l-4 text-left focus:outline-none
                                ${location.pathname === link.path
                                    ? 'text-blue-600 bg-blue-50 border-blue-600 font-bold' 
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50 border-transparent hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                {link.name}
                                <div className={`w-2 h-2 bg-current rounded-full transition-opacity duration-200 ${
                                    location.pathname === link.path ? 'opacity-100' : 'opacity-0'
                                }`}></div>
                            </div>
                        </button>
                    ))}

                    {/* Mobile Login */}
                    <div className="px-6 pt-6 mt-4 border-t border-gray-200">
                        <button 
                            type='button' 
                            className='w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full 
                                     font-semibold cursor-pointer hover:from-pink-600 hover:to-purple-700 
                                     transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-300'
                            onClick={() => {
                                navigate('/login')
                                closeMobileMenu()
                            }}
                        >
                            Login
                        </button>
                    </div>

                    {/* Extra info */}
                    <div className="px-6 pt-8 mt-8 border-t border-gray-200">
                        <div className="text-sm text-gray-500 text-center leading-relaxed">
                            Transform your Excel data into<br />
                            <span className="text-blue-600 font-medium">beautiful visualizations</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar
