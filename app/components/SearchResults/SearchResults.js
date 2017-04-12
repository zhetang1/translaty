import React, { PropTypes } from 'react'
import { userContainer, subHeader, errorMsg } from 'sharedStyles/styles.css'
import { QuestionContainer } from 'containers'

SearchResults.propTypes = {
    phrase: PropTypes.string.isRequired,
    isFetching: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    questionIds: PropTypes.array.isRequired,
};

export default function SearchResults(props) {
    return (
        <div>
            {props.isFetching === true
                ?<p className={subHeader}>{'Loading'}</p>
                :<div>
                    <div className={userContainer}>
                        <div>{props.phrase}</div>
                    </div>
                    {props.questionIds.map((id) => (
                        <QuestionContainer
                            questionId={id}
                            key={id} />
                    ))}
                    {props.questionIds.length === 0
                        ? <p className={subHeader}>
                            {`It looks like ${props.name.split(' ')[0]} hasn't asked any question yet.`}
                        </p>
                        : null}
                </div>}
            {props.error ? <p className={errorMsg}>{props.error}</p> : null }
        </div>)
}