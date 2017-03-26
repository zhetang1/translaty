import React, { PropTypes } from 'react'
import { newQuestionContainer, header } from './styles.css'
import { errorMsg } from 'sharedStyles/styles.css'
import { QuestionContainer } from 'containers'
import { List } from 'immutable'

NewQuestionsAvailable.propTypes = {
    handleClick: PropTypes.func.isRequired,
};

function NewQuestionsAvailable ({handleClick}) {
    return (
        <div className={newQuestionContainer} onClick={handleClick}>
            {'New Questions Available'}
        </div>
    )
}

Feed.propTypes = {
    questionIds: PropTypes.instanceOf(List),
    error: PropTypes.string.isRequired,
    isFetching: PropTypes.bool.isRequired,
    newQuestionsAvailable: PropTypes.bool.isRequired,
    resetNewDucksAvailable: PropTypes.func.isRequired,
};

export default function Feed (props) {
    return props.isFetching === true
        ? <h1 className={header}>{'Fetching'}</h1>
        : <div>
        {props.newQuestionsAvailable ? <NewQuestionsAvailable handleClick={props.resetNewDucksAvailable} /> : null}
        {props.questionIds.size === 0
            ? <p className={header}>{'This is unfortunate.'} <br /> {'It appears there are no questions yet'}</p>
            : null}
        {props.questionIds.map((id) => (
            <QuestionContainer questionId={id} key={id} />
        ))}
        {props.error ? <p className={errorMsg}>{props.error}</p> : null}
    </div>
}