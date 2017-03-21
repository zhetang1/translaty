import { fetchUsersQuestions } from 'helpers/ddb'
import { addMultipleDucks } from 'redux/modules/ducks'
import { createQuestionsFromDdbResponse } from 'helpers/utils'

const ADD_SINGLE_USERS_DUCK = 'ADD_SINGLE_USERS_DUCK';
const FETCHING_USERS_DUCKS = 'FETCHING_USERS_DUCKS';
const FETCHING_USERS_DUCKS_ERROR = 'FETCHING_USERS_DUCKS_ERROR';
const FETCHING_USERS_DUCKS_SUCCESS = 'FETCHING_USERS_DUCKS_SUCCESS';

function fetchingUsersDucks (username) {
    return {
        type: FETCHING_USERS_DUCKS,
        username,
    }
}

function fetchingUsersDucksError (error) {
    console.warn(error);
    return {
        type: FETCHING_USERS_DUCKS_ERROR,
        error: 'Error fetching Users Ducks Ids',
    }
}

function fetchingUsersDucksSuccess (username, duckIds) {
    return {
        type: FETCHING_USERS_DUCKS_SUCCESS,
        username,
        duckIds,
        lastUpdated: Date.now(),
    }
}

export function addSingleUsersDuck (username, duckId) {
    return {
        type: ADD_SINGLE_USERS_DUCK,
        username,
        duckId,
    }
}

export function fetchAndHandleUsersDucks(username) {
    return function (dispatch, getState) {
        dispatch(fetchingUsersDucks());
        fetchUsersQuestions(username, getState().users.ddbDocClient)
            .then((response) => dispatch(addMultipleDucks(createQuestionsFromDdbResponse(response).map)))
            .then((response) => dispatch(fetchingUsersDucksSuccess(username, Object.keys(response.ducks))))
            .catch((error) => dispatch(fetchingUsersDucksError(error)))
    }
}

const initialUserDucksState = {
    isFetching: true,
    error: '',
    lastUpdated: 0,
    duckIds: [],
};

function usersDuck (state = initialUserDucksState, action) {
    switch (action.type) {
        case ADD_SINGLE_USERS_DUCK :
            return {
                ...state,
                duckIds: state.duckIds.concat([action.duckId])
            };
        default :
            return state
    }
}



const initialState = {
    isFetching: true,
    error: ''
};

export default function usersDucks (state = initialState, action) {
    switch (action.type) {
        case FETCHING_USERS_DUCKS :
            return {
                ...state,
                isFetching: true,
            };
        case FETCHING_USERS_DUCKS_ERROR :
            return {
                ...state,
                isFetching: false,
                error: action.error,
            };
        case FETCHING_USERS_DUCKS_SUCCESS :
            return {
                ...state,
                isFetching: false,
                error: '',
                [action.username]: {
                    lastUpdated: action.lastUpdated,
                    duckIds: action.duckIds,
                },
            };
        case ADD_SINGLE_USERS_DUCK :
            return typeof state[action.username] === 'undefined'
                ? state
                : {
                    ...state,
                    isFetching: false,
                    error: '',
                    [action.username]: usersDuck(state[action.username]),
                };
        default :
            return state
    }
}