import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { QuestionDetails } from 'components'
import { bindActionCreators } from 'redux'
import * as questionActionCreators from 'redux/modules/questions'
import * as likeCountActionCreators from 'redux/modules/likeCount'
import * as repliesActionCreators from 'redux/modules/replies'
import * as userActionCreators from 'redux/modules/users'
import * as usersLikesActionCreator from 'redux/modules/usersLikes'
import { formatReply } from 'helpers/utils'
import { retrievingCurrentUserFromLocalStorage, retrievingCurrentUserNameFromLocalStorage,
    createDdbDocClient } from 'helpers/cognito'
import { formatUserInfo } from 'helpers/utils'

const QuestionDetailsContainer = React.createClass({
    propTypes: {
        authedUser: PropTypes.object.isRequired,
        questionId: PropTypes.string.isRequired,
        isFetching: PropTypes.bool.isRequired,
        error: PropTypes.string.isRequired,
        questionAlreadyFetched: PropTypes.bool.isRequired,
        removeFetching: PropTypes.func.isRequired,
        fetchAndHandleQuestion: PropTypes.func.isRequired,
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
            this.props.addAndHandleReply(this.props.questionId, formatReply(this.props.authedUser, reply))
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

        this.props.initLikeFetch(this.props.questionId);
        if (this.props.questionAlreadyFetched === false) {
            this.props.fetchAndHandleQuestion(this.props.questionId)
        } else {
            this.props.removeFetching()
        }
    },
    render () {
        return (
            <QuestionDetails
                handleSubmit={this.handleSubmit}
                questionId={this.props.questionId}
                isFetching={this.props.isFetching}
                error={this.props.error}/>
        )
    },
});

function mapStateToProps({questions, likeCount, users}, props) {
    return {
        isFetching: questions.get('isFetching') || likeCount.isFetching,
        error: questions.get('error'),
        authedUser: users.authedId === '' ? {} : users[users.authedId].info,
        questionId: props.routeParams.questionId,
        questionAlreadyFetched: !!questions.get(props.routeParams.questionId)
    }
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators({
        ...questionActionCreators,
        ...likeCountActionCreators,
        ...repliesActionCreators,
        ...userActionCreators,
        ...usersLikesActionCreator,
    }, dispatch)
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(QuestionDetailsContainer)