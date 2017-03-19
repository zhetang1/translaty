import { saveQuestion, fetchQuestion } from 'helpers/ddb'
import { closeModal } from './modal'
import { addSingleUsersDuck } from './usersDucks'
import { Map } from 'immutable'

const FETCHING_DUCK = 'FETCHING_DUCK';
const ADD_DUCK = 'ADD_DUCK';
const FETCHING_DUCK_SUCCESS = 'FETCHING_DUCK_SUCCESS';
const FETCHING_DUCK_ERROR = 'FETCHING_DUCK_ERROR';
const REMOVE_FETCHING = 'REMOVE_FETCHING';
const ADD_MULTIPLE_DUCKS = 'ADD_MULTIPLE_DUCKS';

function fetchingDuck () {
    return {
        type: FETCHING_DUCK,
    }
}

function fetchingDuckError (error) {
    return {
        type: FETCHING_DUCK_ERROR,
        error: 'Error fetching Duck',
    }
}

function fetchingDuckSuccess (question) {
    return {
        type: FETCHING_DUCK_SUCCESS,
        question,
    }
}

export function removeFetching () {
    return {
        type: REMOVE_FETCHING,
    }
}

function addDuck (duck) {
    return {
        type: ADD_DUCK,
        duck,
    }
}

export function duckFanout (duck) {
    return function (dispatch, getState) {
        const users = getState().users;
        const username = users.authedId;
        const ddbDocClient = users.ddbDocClient;
        const duckId = duck.name.concat('_').concat(duck.timestamp);
        duck.duckId = duckId;
        saveQuestion(duckId, duck, ddbDocClient)
            .then(() => {
                dispatch(addDuck(duck));
                dispatch(closeModal());
                dispatch(addSingleUsersDuck(username, duckId))
            })
            .catch((err) => {
                console.warn('Error in duckFanout', err)
            })
    }
}

export function addMultipleDucks (ducks) {
    return {
        type: ADD_MULTIPLE_DUCKS,
        ducks,
    }
}

export function fetchAndHandleDuck (questionId) {
    return function (dispatch, getState) {
        dispatch(fetchingDuck());
        fetchQuestion(questionId, getState().users.ddbDocClient)
            .then((response) => {
                dispatch(fetchingDuckSuccess(response.Item))
            })
            .catch((error) => dispatch(fetchingDuckError(error)))
    }
}

const initialState = Map({
    isFetching: true,
    error: ''
});

export default function ducks (state = initialState, action) {
    switch (action.type) {
        case FETCHING_DUCK :
            return state.merge({
                isFetching: true,
            });
        case ADD_DUCK :
        case FETCHING_DUCK_SUCCESS :
            return state.merge({
                error: '',
                isFetching: false,
                [action.question.username_timestamp]: action.question,
            });
        case FETCHING_DUCK_ERROR :
            return state.merge({
                isFetching: false,
                error: action.error,
            });
        case REMOVE_FETCHING :
            return state.merge({
                isFetching: false,
                error: '',
            });
        case ADD_MULTIPLE_DUCKS :
            return state.merge(action.ducks);
        default :
            return state
    }
}