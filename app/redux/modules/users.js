import { signUp, confirmRegistration, authenticateUser, createDdbDocClient, logout } from 'helpers/cognito'
import { createReadOnlyDdbDocClient, clearAwsConfig } from 'helpers/ddb'
import { formatUserInfo } from 'helpers/utils'

const AUTH_USER = 'AUTH_USER';
const UNAUTH_USER = 'UNAUTH_USER';
const FETCHING_USER = 'FETCHING_USER';
const FETCHING_USER_FAILURE = 'FETCHING_USER_FAILURE';
const FETCHING_USER_SUCCESS = 'FETCHING_USER_SUCCESS';
const REMOVE_FETCHING_USER = 'REMOVE_FETCHING_USER';

export function authUser (username, ddbDocClient) {
    return {
        type: AUTH_USER,
        username,
        ddbDocClient,
    }
}

function unauthUser() {
    return {
        type: UNAUTH_USER,
    }
}

function fetchingUser() {
    return {
        type: FETCHING_USER,
    }
}

function fetchingUserFailure(error) {
    console.warn(error);
    return {
        type: FETCHING_USER_FAILURE,
        error: 'Error fetching user.',
    }
}

export function fetchingUserSuccess(username, user, ddbDocClient) {
    return {
        type: FETCHING_USER_SUCCESS,
        username,
        user,
        ddbDocClient,
        timestamp: Date.now(),
    }
}

export function fetchAndHandleUser (username) {
    return function (dispatch, getState) {
        dispatch(fetchingUser());
        return dispatch(fetchingUserSuccess(username, formatUserInfo(username), getState().users.ddbDocClient));
    }
}

export function signUpNewUser (email, username, pw) {
    return function () {
        return signUp(email, username, pw)
    }
}

export function confirmUser (username, pw) {
    return function () {
        return confirmRegistration(username, pw)
    }
}

export function fetchAndHandleAuthedUser (username, pw) {
    return function (dispatch) {
        dispatch(fetchingUser());
        return authenticateUser(username, pw)
            .then((result) => {
                return dispatch(fetchingUserSuccess(username, formatUserInfo(username),
                    createDdbDocClient(result)))
        })
            .then((user) => dispatch(authUser(user.username, user.ddbDocClient)))
            .catch((error) => dispatch(fetchingUserFailure(error)))
    }
}

export function logoutAndUnauth() {
    return function (dispatch) {
        logout();
        dispatch(unauthUser())
    }
}

export function removeFetchingUser () {
    return {
        type: REMOVE_FETCHING_USER
    }
}

const initialUserState = {
    lastUpdated: 0,
    info: {
        name: '',
    }
};

function user (state = initialUserState, action) {
    switch (action.type) {
        case FETCHING_USER_SUCCESS :
            return {
                ...state,
                info: action.user,
                lastUpdated: action.timestamp
            };
        default :
            return state
    }
}

const initialState = {
    isFetching: true,
    error: '',
    isAuthed: false,
    authedId: '',
    ddbDocClient: createReadOnlyDdbDocClient(),
};

export default function users (state = initialState, action) {
    switch (action.type) {
        case AUTH_USER :
            return {
                ...state,
                isAuthed: true,
                authedId: action.username,
                ddbDocClient: action.ddbDocClient,

            };
        case UNAUTH_USER :
            return {
                ...state,
                isAuthed: false,
                authedId: '',
                ddbDocClient: createReadOnlyDdbDocClient(),
            };
        case FETCHING_USER :
            return {
                ...state,
                isFetching: true
            };
        case FETCHING_USER_FAILURE :
            return {
                ...state,
                isFetching: false,
                error: action.error
            };
        case FETCHING_USER_SUCCESS :
            return action.user === null
                ? {
                    ...state,
                    isFetching: false,
                    error: ''
                }
                : {
                    ...state,
                    isFetching: false,
                    error: '',
                    [action.username]: user(state[action.username], action),
                };
        case REMOVE_FETCHING_USER :
            return {
                ...state,
                isFetching: false
            };
        default :
            return state
    }
}