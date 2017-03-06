import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Feed } from 'components'
import * as feedActionCreators from 'redux/modules/feed'
import * as userActionCreators from 'redux/modules/users'
import * as usersLikesActionCreator from 'redux/modules/usersLikes'
import { List } from 'immutable'
import { firebaseAuth } from 'config/constants'
import { formatUserInfo } from 'helpers/utils'

const FeedContainer = React.createClass({
    propTypes: {
        duckIds: PropTypes.instanceOf(List),
        newDucksAvailable: PropTypes.bool.isRequired,
        error: PropTypes.string.isRequired,
        isFetching: PropTypes.bool.isRequired,
        setAndHandleFeedListener: PropTypes.func.isRequired,
        resetNewDucksAvailable: PropTypes.func.isRequired,
        authUser: PropTypes.func.isRequired,
        setUsersLikes: PropTypes.func.isRequired,
    },
    componentDidMount () {
        firebaseAuth().onAuthStateChanged((user) => {
            if (user) {
                const userData = user.providerData[0];
                const userInfo = formatUserInfo(userData.displayName, userData.photoURL, userData.uid);
                this.props.authUser(user.uid);
                this.props.fetchingUserSuccess(user.uid, userInfo, Date.now());
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
            newDucksAvailable={this.props.newDucksAvailable}
            error={this.props.error}
            isFetching={this.props.isFetching}
            resetNewDucksAvailable={this.props.resetNewDucksAvailable}
            duckIds={this.props.duckIds} />
        )
    }
});

function mapStateToProps ({feed}) {
    return {
        newDucksAvailable: feed.get('newDucksAvailable'),
        error: feed.get('error'),
        isFetching: feed.get('isFetching'),
        duckIds: feed.get('duckIds'),
    }
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators({
        ...feedActionCreators,
        ...userActionCreators,
        ...usersLikesActionCreator,
    }, dispatch)
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FeedContainer)