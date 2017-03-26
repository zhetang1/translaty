import { fetchQuestion } from 'helpers/ddb'
import { ADD_LIKE, REMOVE_LIKE } from './usersLikes'
const FETCHING_COUNT = 'FETCHING_COUNT';
const FETCHING_COUNT_ERROR = 'FETCHING_COUNT_ERROR';
const FETCHING_COUNT_SUCCESS = 'FETCHING_COUNT_SUCCESS';

function fetchingCount() {
    return {
        type: FETCHING_COUNT,
    }
}

function fetchingCountError(error) {
    return {
        type: FETCHING_COUNT_ERROR,
        error: 'Error fetching question\'s like count',
    }
}

function fetchingCountSuccess(questionId, count) {
    return {
        type: FETCHING_COUNT_SUCCESS,
        questionId,
        count,
    }
}

export function initLikeFetch(questionId) {
    return function (dispatch, getState) {
        dispatch(fetchingCount());

        fetchQuestion(questionId, getState().users.ddbDocClient)
            .then((response) => dispatch(fetchingCountSuccess(questionId, response.Item.likeCount)))
            .catch((error) => dispatch(fetchingCountError(error)))
    }
}

function count (state = 0, action) {
    switch (action.type) {
        case ADD_LIKE :
            return state + 1;
        case REMOVE_LIKE :
            return state - 1;
        default :
            return state
    }
}

const initialState = {
    isFetching: false,
    error: ''
};

export default function likeCounts (state = initialState, action) {
    switch (action.type) {
        case FETCHING_COUNT :
            return {
                ...state,
                isFetching: true,
            };
        case FETCHING_COUNT_ERROR :
            return {
                ...state,
                isFetching: false,
                error: action.error,
            };
        case FETCHING_COUNT_SUCCESS :
            return {
                ...state,
                ...initialState,
                [action.questionId] : action.count,
            };
        case ADD_LIKE :
        case REMOVE_LIKE :
            return typeof state[action.questionId] === 'undefined'
                ? state
                : {
                ...state,
                [action.questionId]: count(state[action.questionId], action),
            };
        default :
            return state
    }
}
