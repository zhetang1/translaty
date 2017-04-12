import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { container, navContainer } from './styles.css'
import { link } from 'sharedStyles/styles.css'
import { ModalContainer } from 'containers'

Navigation.propTypes = ActionLinks.propTypes = NavLinks.propTypes = {
    isAuthed: PropTypes.bool.isRequired,
    authedId: PropTypes.string.isRequired,
};

function NavLinks({isAuthed, authedId}) {
    return isAuthed === true
        ? <ul>
            <li><Link className={link} to="/">{'Home'}</Link></li>
            <li>{authedId}</li>
            {/*<li><Link className={link} to="/search">{'Search'}</Link></li>*/}
            <li><Link className={link} to="/contactUs">{'Contact Us'}</Link></li>
        </ul>
        : null
}

function ActionLinks({isAuthed}) {
    return isAuthed === true
        ? <ul>
            <li><ModalContainer /></li>
            <li><Link className={link} to="/logout">{'Logout'}</Link></li>
        </ul>
        : <ul>
            <li><Link className={link} to="/">{'Home'}</Link></li>
            <li><Link className={link} to="/auth">{'Authenticate'}</Link></li>
            {/*<li><Link className={link} to="/search">{'Search'}</Link></li>*/}
            <li><Link className={link} to="/contactUs">{'Contact Us'}</Link></li>
        </ul>
}

export default function Navigation ({isAuthed, authedId}) {
    return (
        <div className={container}>
            <nav className={navContainer}>
                <NavLinks isAuthed={isAuthed} authedId={authedId} />
                <ActionLinks isAuthed={isAuthed} authedId={authedId} />
            </nav>
        </div>
    )
}