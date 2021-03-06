import {saveToUsersLikes, deleteFromUsersLikes, incrementNumberOfLikes, decrementNumberOfLikes, fetchUsersLikes}
from 'helpers/ddb'

export const ADD_LIKE = 'ADD_LIKE';
export const REMOVE_LIKE = 'REMOVE_LIKE';
const CLEAR_LIKE = 'CLEAR_LIKE';
const FETCHING_LIKES = 'FETCHING_LIKES';
const FETCHING_LIKES_ERROR = 'FETCHING_LIKES_ERROR';
const FETCHING_LIKES_SUCCESS = 'FETCHING_LIKES_SUCCESS';

function fetchingLikes() {
    return {
        type: FETCHING_LIKES,
    }
}

function fetchingLikeError(error) {
    console.warn(error);
    return {
        type: FETCHING_LIKES_ERROR,
        error: 'Error fetching likes',
    }
}

function fetchingLikeSuccess(likes) {
    return {
        type: FETCHING_LIKES_SUCCESS,
        likes,
    }
}

function addLike(questionId) {
    return {
        type: ADD_LIKE,
        questionId,
    }
}

function removeLike(questionId) {
    return {
        type: REMOVE_LIKE,
        questionId,
    }
}

export function clearLike() {
    return {
        type: CLEAR_LIKE,
    }
}

export function addAndHandleLike(questionId, e) {
    e.stopPropagation();
    return function (dispatch, getState) {
        dispatch(addLike(questionId));
        const users = getState().users;
        const username = users.authedId;
        const ddbDocClient = users.ddbDocClient;
        Promise.all([
            saveToUsersLikes(username, questionId, ddbDocClient),
            incrementNumberOfLikes(questionId, ddbDocClient)
        ]).catch((error) => {
            console.warn(error);
            dispatch(removeLike(questionId))
        })
    }
}

export function handleDeleteLike(questionId, e) {
    e.stopPropagation();
    return function (dispatch, getState) {
        dispatch(removeLike(questionId));
        const users = getState().users;
        const ddbDocClient = users.ddbDocClient;
        Promise.all([
            deleteFromUsersLikes(users.authedId, questionId, ddbDocClient),
            decrementNumberOfLikes(questionId, ddbDocClient)
        ]).catch((error) => {
            console.error(error);
            dispatch(addLike(questionId))
        })
    }
}

export function setUsersLikes () {
    return function (dispatch, getState) {
        const users = getState().users;
        dispatch(fetchingLikes());
        fetchUsersLikes(users.authedId, users.ddbDocClient)
            .then((likes) => {
                const map = {};
                likes.Items.forEach((x) => map[x.questionId] = true);
                dispatch(fetchingLikeSuccess(map))
            })
            .catch((error) => dispatch(fetchingLikeError(error)))
    }
}

const initialState = {
    isFetching: false,
    error: ''
};

export default function usersLikes (state = initialState, action) {
    switch (action.type) {
        case CLEAR_LIKE :
            return initialState;
        case FETCHING_LIKES :
            return {
                ...state,
                isFetching: true,
            };
        case FETCHING_LIKES_ERROR :
            return {
                ...state,
                isFetching: false,
                error: action.error,
            };
        case FETCHING_LIKES_SUCCESS :
            return {
                ...state,
                ...action.likes,
                isFetching: false,
                error: '',
            };
        case ADD_LIKE :
            return {
                ...state,
                [action.questionId] :true,
            };
        case REMOVE_LIKE :
            return Object.keys(state)
                .filter((questionId) => action.questionId !== questionId)
                .reduce((prev, current) => {
                    prev[current] = state[current];
                    return prev
                }, {});
        default :
            return state
    }
}