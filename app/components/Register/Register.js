import React, { PropTypes } from 'react'

Register.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    onAuth: PropTypes.func.isRequired,
    email: PropTypes.string,
    pw: PropTypes.string,
};

export default function Register ( {onAuth, email, pw} ) {
    return (
        <div className="col-sm-6 col-sm-offset-3">
            <h1>Register</h1>
            <form onSubmit={onAuth}>
                <div className="form-group">
                    <label>Email</label>
                    <input className="form-control" ref={(e) => email = e} placeholder="Email"/>
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Password" ref={(e) => pw = e}/>
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    )
}