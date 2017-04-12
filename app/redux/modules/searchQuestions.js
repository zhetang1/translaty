import { search } from 'helpers/es'
import { addMultipleQuestions } from 'redux/modules/questions'
import { createQuestionsFromDdbResponse } from 'helpers/utils'

const ADD_SINGLE_SEARCH_QUESTION = 'ADD_SINGLE_SEARCH_QUESTION';
const FETCHING_SEARCH_QUESTIONS = 'FETCHING_SEARCH_QUESTIONS';
const FETCHING_SEARCH_QUESTIONS_ERROR = 'FETCHING_SEARCH_QUESTIONS_ERROR';
const FETCHING_SEARCH_QUESTIONS_SUCCESS = 'FETCHING_SEARCH_QUESTIONS_SUCCESS';

function fetchingSearchQuestions (username) {
    return {
        type: FETCHING_SEARCH_QUESTIONS,
        username,
    }
}

function fetchingSearchQuestionsError (error) {
    console.warn(error);
    return {
        type: FETCHING_SEARCH_QUESTIONS_ERROR,
        error: 'Error searching Questions',
    }
}

function fetchingSearchQuestionsSuccess (phrase, questionIds) {
    return {
        type: FETCHING_SEARCH_QUESTIONS_SUCCESS,
        phrase,
        questionIds,
        lastUpdated: Date.now(),
    }
}

export function addSingleSearchQuestion (username, questionId) {
    return {
        type: ADD_SINGLE_SEARCH_QUESTION,
        username,
        questionId,
    }
}

export function fetchAndHandleSearchQuestions(phrase) {
    return function (dispatch) {
        dispatch(fetchingSearchQuestions());
        search(phrase)
            .then((response) => {
                console.log(response);
                const questionsFromDdbResponse = createQuestionsFromDdbResponse(response);
                dispatch(addMultipleQuestions(questionsFromDdbResponse.map));
                dispatch(fetchingSearchQuestionsSuccess(username, questionsFromDdbResponse.sortedIds))
            })
            .catch((error) => dispatch(fetchingSearchQuestionsError(error)))
    }
}

const initialSearchQuestionsState = {
    isFetching: true,
    error: '',
    lastUpdated: 0,
    questionIds: [],
};

function searchQuestion (state = initialSearchQuestionsState, action) {
    switch (action.type) {
        case ADD_SINGLE_SEARCH_QUESTION :
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

export default function searchQuestions (state = initialState, action) {
    switch (action.type) {
        case FETCHING_SEARCH_QUESTIONS :
            return {
                ...state,
                isFetching: true,
            };
        case FETCHING_SEARCH_QUESTIONS_ERROR :
            return {
                ...state,
                isFetching: false,
                error: action.error,
            };
        case FETCHING_SEARCH_QUESTIONS_SUCCESS :
            return {
                ...state,
                isFetching: false,
                error: '',
                [action.username]: {
                    lastUpdated: action.lastUpdated,
                    questionIds: action.questionIds,
                },
            };
        case ADD_SINGLE_SEARCH_QUESTION :
            return typeof state[action.username] === 'undefined'
                ? state
                : {
                    ...state,
                    isFetching: false,
                    error: '',
                    [action.username]: searchQuestion(state[action.username], action),
                };
        default :
            return state
    }
}