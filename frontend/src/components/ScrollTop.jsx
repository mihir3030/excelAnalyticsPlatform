import { useLocation } from "react-router-dom"
import { useEffect } from "react"

function ScrollTop() {
    const {pathname} = useLocation()

    useEffect(() => {
        // scroll top of page if you refresh or change route
        window.scrollTo({
            top:0,
            behavior: "smooth"
        })
    }, [pathname])
}

export default ScrollTop

