import React, { PropTypes } from 'react'

Login.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    onAuth: PropTypes.func.isRequired,
    username: PropTypes.string,
    pw: PropTypes.string,
};


export default function Login ( {onAuth, username, pw} ) {
    return (
        <div className="col-sm-6 col-sm-offset-3">
            <h1> Login </h1>
            <form onSubmit={onAuth}>
                <div className="form-group">
                    <label>User Name</label>
                    <input className="form-control" ref={(e) => username = e} placeholder="User Name"/>
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Password" ref={(e) => pw = e}/>
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    )
}