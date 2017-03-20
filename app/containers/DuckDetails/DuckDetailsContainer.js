import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { DuckDetails } from 'components'
import { bindActionCreators } from 'redux'
import * as duckActionCreators from 'redux/modules/ducks'
import * as likeCountActionCreators from 'redux/modules/likeCount'
import * as repliesActionCreators from 'redux/modules/replies'
import * as userActionCreators from 'redux/modules/users'
import * as usersLikesActionCreator from 'redux/modules/usersLikes'
import { formatReply } from 'helpers/utils'
import { retrievingCurrentUserFromLocalStorage, retrievingCurrentUserNameFromLocalStorage,
    createDdbDocClient } from 'helpers/cognito'
import { formatUserInfo } from 'helpers/utils'

const DuckDetailsContainer = React.createClass({
    propTypes: {
        authedUser: PropTypes.object.isRequired,
        duckId: PropTypes.string.isRequired,
        isFetching: PropTypes.bool.isRequired,
        error: PropTypes.string.isRequired,
        duckAlreadyFetched: PropTypes.bool.isRequired,
        removeFetching: PropTypes.func.isRequired,
        fetchAndHandleDuck: PropTypes.func.isRequired,
        initLikeFetch: PropTypes.func.isRequired,
        addAndHandleReply: PropTypes.func.isRequired,
        authUser: PropTypes.func.isRequired,
        setUsersLikes: PropTypes.func.isRequired,
        fetchingUserSuccess: PropTypes.func.isRequired,
        removeFetchingUser: PropTypes.func.isRequired,
    },
    contextTypes: {
        router: PropTypes.object.isRequired,
    },
    handleSubmit (reply, e) {
        if (Object.keys(this.props.authedUser).length === 0)
        {
            e.stopPropagation();
            this.context.router.push('/auth')
        }
        else
        {
            this.props.addAndHandleReply(this.props.duckId, formatReply(this.props.authedUser, reply))
        }
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

        this.props.initLikeFetch(this.props.duckId);
        if (this.props.duckAlreadyFetched === false) {
            this.props.fetchAndHandleDuck(this.props.duckId)
        } else {
            this.props.removeFetching()
        }
    },
    render () {
        return (
            <DuckDetails
                handleSubmit={this.handleSubmit}
                duckId={this.props.duckId}
                isFetching={this.props.isFetching}
                error={this.props.error}/>
        )
    },
});

function mapStateToProps({ducks, likeCount, users}, props) {
    return {
        isFetching: ducks.get('isFetching') || likeCount.isFetching,
        error: ducks.get('error'),
        authedUser: users.authedId === '' ? {} : users[users.authedId].info,
        duckId: props.routeParams.duckId,
        duckAlreadyFetched: !!ducks.get(props.routeParams.duckId)
    }
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators({
        ...duckActionCreators,
        ...likeCountActionCreators,
        ...repliesActionCreators,
        ...userActionCreators,
        ...usersLikesActionCreator,
    }, dispatch)
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DuckDetailsContainer)