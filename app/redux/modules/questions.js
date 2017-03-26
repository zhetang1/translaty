import { saveQuestion, fetchQuestion } from 'helpers/ddb'
import { closeModal } from './modal'
import { addSingleUsersQuestion } from './usersQuestions'
import { Map } from 'immutable'

const FETCHING_QUESTION = 'FETCHING_QUESTION';
const ADD_QUESTION = 'ADD_QUESTION';
const FETCHING_QUESTION_SUCCESS = 'FETCHING_QUESTION_SUCCESS';
const FETCHING_QUESTION_ERROR = 'FETCHING_QUESTION_ERROR';
const REMOVE_FETCHING = 'REMOVE_FETCHING';
const ADD_MULTIPLE_QUESTIONS = 'ADD_MULTIPLE_QUESTIONS';

function fetchingQuestion () {
    return {
        type: FETCHING_QUESTION,
    }
}

function fetchingQuestionError (error) {
    console.warn(error);
    return {
        type: FETCHING_QUESTION_ERROR,
        error: 'Error fetching Question',
    }
}

function fetchingQuestionSuccess (question) {
    return {
        type: FETCHING_QUESTION_SUCCESS,
        question,
    }
}

export function removeFetching () {
    return {
        type: REMOVE_FETCHING,
    }
}

function addQuestion (question) {
    return {
        type: ADD_QUESTION,
        question,
    }
}

export function questionFanout (question) {
    return function (dispatch, getState) {
        const users = getState().users;
        const username = users.authedId;
        const ddbDocClient = users.ddbDocClient;
        const questionId = question.name.concat('_', question.timestamp);
        question.username_timestamp = questionId;
        saveQuestion(questionId, question, ddbDocClient)
            .then(() => {
                dispatch(addQuestion(question));
                dispatch(closeModal());
                dispatch(addSingleUsersQuestion(username, questionId))
            })
            .catch((err) => {
                console.warn('Error in questionFanout', err)
            })
    }
}

export function addMultipleQuestions (questions) {
    return {
        type: ADD_MULTIPLE_QUESTIONS,
        questions,
    }
}

export function fetchAndHandleQuestion (questionId) {
    return function (dispatch, getState) {
        dispatch(fetchingQuestion());
        fetchQuestion(questionId, getState().users.ddbDocClient)
            .then((response) => {
                dispatch(fetchingQuestionSuccess(response.Item))
            })
            .catch((error) => dispatch(fetchingQuestionError(error)))
    }
}

const initialState = Map({
    isFetching: true,
    error: ''
});

export default function questions (state = initialState, action) {
    switch (action.type) {
        case FETCHING_QUESTION :
            return state.merge({
                isFetching: true,
            });
        case ADD_QUESTION :
        case FETCHING_QUESTION_SUCCESS :
            return state.merge({
                error: '',
                isFetching: false,
                [action.question.username_timestamp]: action.question,
            });
        case FETCHING_QUESTION_ERROR :
            return state.merge({
                isFetching: false,
                error: action.error,
            });
        case REMOVE_FETCHING :
            return state.merge({
                isFetching: false,
                error: '',
            });
        case ADD_MULTIPLE_QUESTIONS :
            return state.merge(action.questions);
        default :
            return state
    }
}