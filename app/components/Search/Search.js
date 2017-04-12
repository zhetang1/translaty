import React, { PropTypes } from 'react'

Search.propTypes = {
    onSearch: PropTypes.func.isRequired,
    username: PropTypes.string,
};

export default function Search ( {onSearch, phrase} ) {
    return (
        <div className="col-sm-6 col-sm-offset-3">
            <form onSubmit={onSearch}>
                <div className="form-group">
                    <input className="form-control" ref={(e) => phrase = e} size="100" />
                </div>
                <button type="submit" className="btn btn-primary">{'Search'}</button>
            </form>
        </div>
    )
}