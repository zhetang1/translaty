import React, { PropTypes } from 'react'
import { centeredContainer, largeHeader, errorMsg } from 'sharedStyles/styles.css'
import { Register, Login } from 'components'

Authenticate.propTypes = {
    error: PropTypes.string.isRequired,
    isFetching: PropTypes.bool.isRequired,
    onAuth: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired,
};

export default function Authenticate ({error, isFetching, onAuth, onLogin}) {
    return (
        <div className={centeredContainer}>
            <h1 className={largeHeader}>{'Authenticate'}</h1>
            <Login isFetching={isFetching} onAuth={onLogin} />
            <Register isFetching={isFetching} onAuth={onAuth} />
            <p>
                {'Password must have:'}
                <li>{'Minimum 8 characters'}</li>
                <li>{'Require numbers'}</li>
                <li>{'Require special character'}</li>
                <li>{'Require uppercase letters'}</li>
                <li>{'Require lowercase letters'}</li>
            </p>
            {error ? <p className={errorMsg}>{error}</p> : null}
        </div>
    )
}