import React, { PropTypes } from 'react'
import { userContainer, subHeader, errorMsg } from 'sharedStyles/styles.css'
import { QuestionContainer } from 'containers'

User.propTypes = {
    noUser: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    isFetching: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    questionIds: PropTypes.array.isRequired,
};

export default function User(props) {
    return props.noUser === true
        ? <p className={subHeader}>{'This user does not exist'}</p>
        :<div>
        {props.isFetching === true
            ?<p className={subHeader}>{'Loading'}</p>
            :<div>
            <div className={userContainer}>
                <div>{props.name}</div>
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
    </div>
}