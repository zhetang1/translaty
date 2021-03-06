import { postReply, fetchReplies } from 'helpers/ddb'

const FETCHING_REPLIES = 'FETCHING_REPLIES';
const FETCHING_REPLIES_ERROR = 'FETCHING_REPLIES_ERROR';
const FETCHING_REPLIES_SUCCESS = 'FETCHING_REPLIES_SUCCESS';
const ADD_REPLY = 'ADD_REPLY';
const ADD_REPLY_ERROR = 'ADD_REPLY_ERROR';
const REMOVE_REPLY = 'REMOVE_REPLY';

function addReply (questionId, reply) {
    return {
        type: ADD_REPLY,
        questionId,
        reply,
    }
}

function addReplyError (error) {
    console.warn(error);
    return {
        type: ADD_REPLY_ERROR,
        error: 'Error adding reply',
    }
}

function removeReply (questionId, replyId) {
    return {
        type: REMOVE_REPLY,
        questionId,
        replyId,
    }
}

function fetchingReplies () {
    return {
        type: FETCHING_REPLIES,
    }
}

function fetchingRepliesError (error) {
    console.warn(error);
    return {
        type: FETCHING_REPLIES_ERROR,
        error: 'Error fetching replies',
    }
}

function fetchingRepliesSuccess (questionId, replies) {
    return {
        type: FETCHING_REPLIES_SUCCESS,
        replies,
        questionId,
        lastUpdated: Date.now(),
    }
}

export function addAndHandleReply (questionId, reply) {
    return function (dispatch, getState) {
        const users = getState().users;
        const authedId = users.authedId;
        const timestamp = reply.timestamp;
        const replyId = authedId.concat('_', timestamp);
        const { replyWithId, replyPromise } = postReply(questionId, replyId,
            {authedId, timestamp, reply: reply.reply}, users.ddbDocClient);

        dispatch(addReply(questionId, replyWithId));
        replyPromise.catch((error) => {
            dispatch(removeReply(questionId, replyWithId.replyId));
            dispatch(addReplyError(error))
        })
    }
}

export function fetchAndHandleReplies (questionId) {
    return function (dispatch, getState) {
        dispatch(fetchingReplies());
        fetchReplies(questionId, getState().users.ddbDocClient)
            .then((response) => {
                const replies = {};
                response.Items.forEach( (x) => { replies[x.username_timestamp] = {
                    'name': x.user,
                    'timestamp': x.timestamp,
                    'reply': x.text,
                    } });
                dispatch(fetchingRepliesSuccess(questionId, replies))
            })
            .catch((error) => dispatch(fetchingRepliesError(error)))
    }
}

const initialReply = {
    reply: '',
    username: '',
    timestamp: 0,
    replyId: '',
};

function questionReplies (state = initialReply, action) {
    switch (action.type) {
        case ADD_REPLY :
            return {
                ...state,
                [action.reply.replyId]: action.reply,
            };
        case REMOVE_REPLY :
            return {
                ...state,
                [action.reply.replyId]: undefined,
            };
        default :
            return state
    }
}

const initialQuestionState = {
    lastUpdated: Date.now(),
    replies: {},
};

function repliesAndLastUpdated (state = initialQuestionState, action) {
    switch (action.type) {
        case FETCHING_REPLIES_SUCCESS :
            return {
                ...state,
                lastUpdated: action.lastUpdated,
                replies: action.replies,
            };
        case ADD_REPLY :
        case REMOVE_REPLY :
            return {
                ...state,
                replies: questionReplies(state.replies, action),
            };
        default :
            return state
    }
}

const initialState = {
    isFetching: true,
    error: '',
};

export default function replies (state = initialState, action) {
    switch (action.type) {
        case FETCHING_REPLIES :
            return {
                ...state,
                isFetching: true,
            };
        case FETCHING_REPLIES_ERROR :
        case ADD_REPLY_ERROR :
            return {
                ...state,
                isFetching: false,
                error: action.error,
            };
        case ADD_REPLY :
        case FETCHING_REPLIES_SUCCESS :
        case REMOVE_REPLY :
            return {
                ...state,
                isFetching: false,
                error: '',
                [action.questionId]: repliesAndLastUpdated(state[action.questionId], action),
            };
        default :
            return state
    }
}