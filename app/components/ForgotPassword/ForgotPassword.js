import React, { PropTypes } from 'react'

Login.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    onAuth: PropTypes.func.isRequired,
    username: PropTypes.string,
};


export default function Login ( {onAuth, username} ) {
    return (
        <div className="col-sm-6 col-sm-offset-3">
            <h1>{'Reset password'}</h1>
            <form onSubmit={onAuth}>
                <div className="form-group">
                    <label>User Name</label>
                    <input className="form-control" ref={(e) => username = e} placeholder="User Name"/>
                </div>
                <button type="submit" className="btn btn-primary">{'Reset'}</button>
            </form>
        </div>
    )
}