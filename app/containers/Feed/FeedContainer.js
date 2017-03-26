import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Feed } from 'components'
import * as feedActionCreators from 'redux/modules/feed'
import * as usersActionCreators from 'redux/modules/users'
import * as usersLikesActionCreator from 'redux/modules/usersLikes'
import { List } from 'immutable'
import { retrievingCurrentUserFromLocalStorage, retrievingCurrentUserNameFromLocalStorage,
    createDdbDocClient } from 'helpers/cognito'
import { formatUserInfo } from 'helpers/utils'

const FeedContainer = React.createClass({
    propTypes: {
        questionIds: PropTypes.instanceOf(List),
        newQuestionsAvailable: PropTypes.bool.isRequired,
        error: PropTypes.string.isRequired,
        isFetching: PropTypes.bool.isRequired,
        setAndHandleFeedListener: PropTypes.func.isRequired,
        resetNewDucksAvailable: PropTypes.func.isRequired,
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
        this.props.setAndHandleFeedListener()
    },
    render () {
        return (
            <Feed
            newQuestionsAvailable={this.props.newQuestionsAvailable}
            error={this.props.error}
            isFetching={this.props.isFetching}
            resetNewDucksAvailable={this.props.resetNewDucksAvailable}
            questionIds={this.props.questionIds} />
        )
    }
});

function mapStateToProps ({feed}) {
    return {
        newQuestionsAvailable: feed.get('newQuestionsAvailable'),
        error: feed.get('error'),
        isFetching: feed.get('isFetching'),
        questionIds: feed.get('questionIds'),
    }
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators({
        ...feedActionCreators,
        ...usersActionCreators,
        ...usersLikesActionCreator,
    }, dispatch)
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FeedContainer)