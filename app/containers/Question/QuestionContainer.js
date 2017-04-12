import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Question } from 'components'
import * as usersLikesActions from 'redux/modules/usersLikes'

const { func, object, bool, number } = PropTypes;

const QuestionContainer = React.createClass({
    propTypes: {
        question: object.isRequired,
        numberOfLikes: number,
        isLiked: bool.isRequired,
        hideLikeCount: bool.isRequired,
        hideReplyBtn: bool.isRequired,
        handleDeleteLike: func.isRequired,
        addAndHandleLike: func.isRequired,
    },
    contextTypes: {
        router: object.isRequired,
    },
    getDefaultProps () {
        return {
            hideReplyBtn: false,
            hideLikeCount: true,
        }
    },
    goToProfile (e) {
        e.stopPropagation();
        this.context.router.push('/user/' + this.props.question.get('user'))
    },
    handleClick (e) {
        e.stopPropagation();
        this.context.router.push('/questionDetail/' + this.props.question.get('username_timestamp'))
    },
    render () {
        return (
            <Question
            goToProfile={this.goToProfile}
            onClick={this.props.hideReplyBtn === true ? null : this.handleClick}
            {...this.props} />
        )
    },
});

function mapStateToProps ({questions, likeCount, usersLikes}, props) {
    return {
        question: questions.get(props.questionId),
        hideLikeCount: props.hideLikeCount,
        hideReplyBtn: props.hideReplyBtn,
        isLiked: usersLikes[props.questionId] === true,
        numberOfLikes: likeCount[props.questionId],
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(usersLikesActions, dispatch)
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(QuestionContainer)