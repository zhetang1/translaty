import React, { PropTypes } from 'react'

import {
    mainContainer, container, content, repliesContainer,
    replyTextAreaContainer, replyTextArea } from './styles.css'
import { subHeader, darkBtn, errorMsg } from 'sharedStyles/styles.css'
import { DuckContainer, RepliesContainer } from 'containers'
import { formatReply } from 'helpers/utils'

function Reply ({submit}) {
    return (
        <div className={replyTextAreaContainer}>
            <button onClick={submit} className={darkBtn}>
                {'Reply'}
            </button>
        </div>
    )
}

DuckDetailsNoReply.propTypes = {
    duckId: PropTypes.string.isRequired,
    isFetching: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default function DuckDetailsNoReply ({duckId, isFetching, error, onClick}) {
    return (
        <div className={mainContainer}>
            {isFetching === true
                ? <p className={subHeader}>{'Fetching'}</p>
                : <div className={container}>
                <div className={content}>
                    <DuckContainer duckId={duckId} hideLikeCount={false} hideReplyBtn={true} />
                    <Reply submit={onClick} />
                </div>
                <div className={repliesContainer}>
                    <RepliesContainer duckId={duckId} />
                </div>
            </div>}
            {error ? <p className={errorMsg}>{error}</p> : null}
        </div>
    )
}