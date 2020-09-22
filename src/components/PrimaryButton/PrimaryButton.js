import React from 'react'
import css from './styles.scss'

function Button({ className, onClick, disabled, children, varient }) {
  return (
    <button
      className={`button ${css.class} ${className || ''} ${varient || 'primary'}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
