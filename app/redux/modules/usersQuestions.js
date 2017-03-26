import { fetchUsersQuestions } from 'helpers/ddb'
import { addMultipleQuestions } from 'redux/modules/questions'
import { createQuestionsFromDdbResponse } from 'helpers/utils'

const ADD_SINGLE_USERS_QUESTION = 'ADD_SINGLE_USERS_QUESTION';
const FETCHING_USERS_QUESTIONS = 'FETCHING_USERS_QUESTIONS';
const FETCHING_USERS_QUESTIONS_ERROR = 'FETCHING_USERS_QUESTIONS_ERROR';
const FETCHING_USERS_QUESTIONS_SUCCESS = 'FETCHING_USERS_QUESTIONS_SUCCESS';

function fetchingUsersQuestions (username) {
    return {
        type: FETCHING_USERS_QUESTIONS,
        username,
    }
}

function fetchingUsersQuestionsError (error) {
    console.warn(error);
    return {
        type: FETCHING_USERS_QUESTIONS_ERROR,
        error: 'Error fetching Users Questions IDs',
    }
}

function fetchingUsersQuestionsSuccess (username, questionIds) {
    return {
        type: FETCHING_USERS_QUESTIONS_SUCCESS,
        username,
        questionIds,
        lastUpdated: Date.now(),
    }
}

export function addSingleUsersQuestion (username, questionId) {
    return {
        type: ADD_SINGLE_USERS_QUESTION,
        username,
        questionId,
    }
}

export function fetchAndHandleUsersQuestions(username) {
    return function (dispatch, getState) {
        dispatch(fetchingUsersQuestions());
        fetchUsersQuestions(username, getState().users.ddbDocClient)
            .then((response) => {
                const questionsFromDdbResponse = createQuestionsFromDdbResponse(response);
                dispatch(addMultipleQuestions(questionsFromDdbResponse.map));
                dispatch(fetchingUsersQuestionsSuccess(username, questionsFromDdbResponse.sortedIds))
            })
            .catch((error) => dispatch(fetchingUsersQuestionsError(error)))
    }
}

const initialUserQuestionsState = {
    isFetching: true,
    error: '',
    lastUpdated: 0,
    questionIds: [],
};

function usersQuestions (state = initialUserQuestionsState, action) {
    switch (action.type) {
        case ADD_SINGLE_USERS_QUESTION :
            return {
                ...state,
                questionIds: state.questionIds.concat([action.questionId])
            };
        default :
            return state
    }
}

const initialState = {
    isFetching: true,
    error: ''
};

export default function usersQuestions (state = initialState, action) {
    switch (action.type) {
        case FETCHING_USERS_QUESTIONS :
            return {
                ...state,
                isFetching: true,
            };
        case FETCHING_USERS_QUESTIONS_ERROR :
            return {
                ...state,
                isFetching: false,
                error: action.error,
            };
        case FETCHING_USERS_QUESTIONS_SUCCESS :
            return {
                ...state,
                isFetching: false,
                error: '',
                [action.username]: {
                    lastUpdated: action.lastUpdated,
                    questionIds: action.questionIds,
                },
            };
        case ADD_SINGLE_USERS_QUESTION :
            return typeof state[action.username] === 'undefined'
                ? state
                : {
                    ...state,
                    isFetching: false,
                    error: '',
                    [action.username]: usersQuestions(state[action.username], action),
                };
        default :
            return state
    }
}