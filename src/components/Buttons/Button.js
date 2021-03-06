import React from 'react'
import './Button.css'

const STYLES = [
    "btn--primary--solid",
    "btn--success--solid",
    "btn--primary--outline",
    "btn--success--outline"
]

const SIZES = [
    'btn--medium',
    'btn--small'
]

const Button = ({ children, type, onClick, buttonStyle, buttonSize }) => {
    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];

    const checkButtonSize = SIZES.includes(buttonSize) ? buttonStyle : SIZES[0];

    return (
        <button className={`btn ${checkButtonStyle} ${checkButtonSize}`} onClick={onClick} type={type}>
            {children}
        </button>
    )
}

export default Button