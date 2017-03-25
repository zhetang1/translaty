import React, { PropTypes } from 'react'

ConfirmRegistration.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    onResend: PropTypes.func.isRequired,
    onAuth: PropTypes.func.isRequired,
    email: PropTypes.string,
    pw: PropTypes.string,
};

export default function ConfirmRegistration ( {onAuth, onResend, email, pw} ) {
    return (
        <div className="col-sm-6 col-sm-offset-3">
            <h1>{'Please confirm your registration'}</h1>
            <p>{'You can login using your User Name and Password after this confirmation.'}</p>
            <form onSubmit={onAuth}>
                <div className="form-group">
                    <label>User Name</label>
                    <input className="form-control" ref={(e) => email = e} placeholder={'User Name'}/>
                </div>
                <div className="form-group">
                    <label>{'Confirmation code received in email'}</label>
                    <input type="password" className="form-control" placeholder={'Code'} ref={(e) => pw = e}/>
                </div>
                <button type="submit" className="btn btn-primary">{'Confirm'}</button>
            </form>
            <p>{'Resend confirmation code'}</p>
            <form onSubmit={onResend}>
                <div className="form-group">
                    <label>User Name</label>
                    <input className="form-control" ref={(e) => email = e} placeholder={'User Name'}/>
                </div>
                <button type="submit" className="btn btn-primary">{'Resend'}</button>
            </form>
        </div>
    )
}