import React, { PropTypes } from 'react'
import { User } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as usersActionCreators from 'redux/modules/users'
import * as usersQuestionsActionCreators from 'redux/modules/usersQuestions'
import * as usersLikesActionCreator from 'redux/modules/usersLikes'
import { staleUser, staleDucks } from 'helpers/utils'
import { retrievingCurrentUserFromLocalStorage, retrievingCurrentUserNameFromLocalStorage,
    createDdbDocClient } from 'helpers/cognito'
import { formatUserInfo } from 'helpers/utils'

const UserContainer = React.createClass({
    propTypes: {
        noUser: PropTypes.bool.isRequired,
        name: PropTypes.string.isRequired,
        isFetching: PropTypes.bool.isRequired,
        error: PropTypes.string.isRequired,
        questionIds: PropTypes.array.isRequired,
        fetchAndHandleUsersQuestions: PropTypes.func.isRequired,
        fetchAndHandleUser: PropTypes.func.isRequired,
        lastUpdatedUser: PropTypes.number.isRequired,
        lastUpdatedDucks: PropTypes.number.isRequired,
        authUser: PropTypes.func.isRequired,
        setUsersLikes: PropTypes.func.isRequired,
        fetchingUserSuccess: PropTypes.func.isRequired,
        removeFetchingUser: PropTypes.func.isRequired,
    },
    componentDidMount () {
        retrievingCurrentUserFromLocalStorage()
            .then((session) => {
                if (session !== undefined && session.isValid()) {
                    const username = retrievingCurrentUserNameFromLocalStorage();
                    const ddbDocClient = createDdbDocClient(session);
                    this.props.fetchingUserSuccess(username, formatUserInfo(username),
                        ddbDocClient, Date.now());
                    this.props.authUser(username, ddbDocClient);
                    this.props.setUsersLikes();
                } else {
                    this.props.removeFetchingUser()
                }
            });

        const username = this.props.routeParams.username;
        if (this.props.noUser === true || staleUser(this.props.lastUpdatedUser)) {
            this.props.fetchAndHandleUser(username);
        }

        if (this.props.noUser === true || staleDucks(this.props.lastUpdatedDucks)) {
            this.props.fetchAndHandleUsersQuestions(username);
        }
    },
    render () {
        return (
            <User
            noUser={this.props.noUser}
            name={this.props.name}
            isFetching={this.props.isFetching}
            error={this.props.error}
            questionIds={this.props.questionIds} />
        )
    }
});

function mapStateToProps ({users, usersQuestions}, props) {
    const specificUsersQuestions = usersQuestions[props.routeParams.username];
    const user = users[props.routeParams.username];
    const noUser = typeof user === 'undefined';
    return {
        noUser,
        name: noUser ? '' : user.info.name,
        isFetching: users.isFetching || usersQuestions.isFetching,
        error: users.error || usersQuestions.error,
        questionIds: specificUsersQuestions ? specificUsersQuestions.questionIds : [],
        lastUpdatedUser: user ? user.lastUpdated : 0,
        lastUpdatedDucks: specificUsersQuestions ? specificUsersQuestions.lastUpdated : 0,
    }
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators({
        ...usersActionCreators,
        ...usersQuestionsActionCreators,
        ...usersLikesActionCreator,
    }, dispatch)
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserContainer)