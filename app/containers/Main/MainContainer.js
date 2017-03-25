import React, { PropTypes } from 'react'
import { Navigation } from 'components'
import { connect } from 'react-redux'
import { container, innerContainer } from './styles.css'
import { bindActionCreators } from 'redux'
import * as userActionCreators from 'redux/modules/users'
import * as usersLikesActionCreator from 'redux/modules/usersLikes'

const MainContainer = React.createClass({
    propTypes: {
        isAuthed: PropTypes.bool.isRequired,
        authedId: PropTypes.string.isRequired,
        authUser: PropTypes.func.isRequired,
        removeFetchingUser: PropTypes.func.isRequired,
        fetchingUserSuccess: PropTypes.func.isRequired,
        setUsersLikes: PropTypes.func.isRequired,
    },
    contextTypes: {
        router: PropTypes.object.isRequired,
    },
    componentDidMount () {
        this.props.removeFetchingUser()
    },
    render () {
        return this.props.isFetching === true
            ? null
            :
            <div className={container}>
                <Navigation isAuthed={this.props.isAuthed} authedId={this.props.authedId} />
                <div className={innerContainer}>
                    {this.props.children}
                </div>
            </div>
    }
});

export default connect(
    ({users}) => ({isAuthed: users.isAuthed, authedId: users.authedId, isFetching: users.isFetching}),
    (dispatch) => bindActionCreators({
        ...userActionCreators,
        ...usersLikesActionCreator
    }, dispatch)
)(MainContainer)
