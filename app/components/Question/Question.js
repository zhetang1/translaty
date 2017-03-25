import React, { PropTypes } from 'react'
import { formatTimestamp } from 'helpers/utils'
import Reply from 'react-icons/lib/fa/mail-reply'
import Star from 'react-icons/lib/fa/star'
import {
questionContainer, contentContainer, avatar, actionContainer,
header, text, likeReplyContainer, icon, likedIcon, author,
} from './styles.css'
import { Map } from 'immutable'

Question.propTypes = {
    question: PropTypes.instanceOf(Map),
    onClick: PropTypes.func,
    isLiked: PropTypes.bool.isRequired,
    addAndHandleLike: PropTypes.func.isRequired,
    handleDeleteLike: PropTypes.func.isRequired,
    numberOfLikes: PropTypes.number,
    hideReplyBtn: PropTypes.bool.isRequired,
    hideLikeCount: PropTypes.bool.isRequired,
    goToProfile: PropTypes.func.isRequired,
};

export default function Question (props) {
    const startIcon = props.isLiked === true ? likedIcon : icon;
    const startFn = props.isLiked === true ? props.handleDeleteLike : props.addAndHandleLike;
    return (
        <div
        className={questionContainer}
        style={{cursor: props.hideReplyBtn === true ? 'default' : 'pointer'}}
        onClick={props.onClick}
        >
            <img src={props.question.get('avatar')} className={avatar} />
            <div className={contentContainer}>
                <div className={header}>
                    <div onClick={props.goToProfile} className={author}>{props.question.get('user')}</div>
                    <div>{formatTimestamp(props.question.get('timestamp'))}</div>
                </div>
                <div className={text}>{props.question.get('text')}</div>
                <div className={likeReplyContainer}>
                    {props.hideReplyBtn === true
                    ? null
                    : <Reply className={icon} />}
                    <div className={actionContainer}>
                        <Star className={startIcon} onClick={(e) => startFn(props.question.get('username_timestamp'), e)} />
                        {props.hideLikeCount === true ? null : <div>{props.numberOfLikes}</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}