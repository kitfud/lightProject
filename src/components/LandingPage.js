import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { setPathname } from '../features/pathname'

export const LandingPage = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPathname(window.location.pathname))
    }, [])

    return (
        <>
            <Link to="shop">Shop</Link>
            <Link to="admin">Admin</Link>
        </>
    )
}
