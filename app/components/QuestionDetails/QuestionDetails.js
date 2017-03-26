import React, { PropTypes } from 'react'

import {
    mainContainer, container, content, repliesContainer,
    replyTextAreaContainer, replyTextArea } from './styles.css'
import { subHeader, darkBtn, errorMsg } from 'sharedStyles/styles.css'
import { QuestionContainer, RepliesContainer } from 'containers'

function Reply ({submit}) {
    function handleSubmit (e) {
        if (Reply.ref.value.length === 0) {
            return
        }

        submit(Reply.ref.value, e);
        Reply.ref.value = ''
    }
    return (
        <div className={replyTextAreaContainer}>
            <textarea
                ref={(ref) => Reply.ref = ref}
                className={replyTextArea}
                maxLength={140}
                placeholder='Your response'
                type='text' />
            <button onClick={handleSubmit} className={darkBtn}>
                {'Submit'}
            </button>
        </div>
    )
}

QuestionDetails.propTypes = {
    questionId: PropTypes.string.isRequired,
    isFetching: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    handleSubmit: PropTypes.func.isRequired,
};

export default function QuestionDetails ({questionId, isFetching, error, handleSubmit}) {
    return (
        <div className={mainContainer}>
            {isFetching === true
                ? <p className={subHeader}>{'Fetching'}</p>
                : <div className={container}>
                <div className={content}>
                    <QuestionContainer questionId={questionId} hideLikeCount={false} hideReplyBtn={true} />
                    <Reply submit={handleSubmit} />
                </div>
                <div className={repliesContainer}>
                    <RepliesContainer questionId={questionId} />
                </div>
            </div>}
            {error ? <p className={errorMsg}>{error}</p> : null}
        </div>
    )
}