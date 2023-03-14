import React from 'react'
import './alert.css'

function Alert(props) {
  return (
    <div>
        <div className={`alert alert-${props.alertType}`} >
            {props.alertMessage}
        </div>
    </div>
  )
}

export default Alert