import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    // const [click, setClick] = useState(false);
    // const handleClick = () => setClick(!click);
    // const showButton = () => {
    //     if (window.innerWidth <= 960) {
    //         setButton(false);
    //     } else {
    //         setButton(true);
    //     }
    // };
    return (
        <>
            <nav className='navbar'>
                <div className='navbar-container'>
                    <Link to="/" className="navbar-logo">Optum</Link>
                    <ul className='nav-menu'>
                        <li className='nav-item'>
                            <Link to='/' className='nav-links'>
                                Home
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/' className='nav-links'>
                                Analysis
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/' className='nav-links'>
                                Visualization
                            </Link>
                        </li>

                    </ul>
                </div>
            </nav >
        </>
    )
}

export default Navbar