import { fetchUsersDucks } from 'helpers/api'
import { addMultipleDucks } from 'redux/modules/ducks'

const ADD_SINGLE_USERS_DUCK = 'ADD_SINGLE_USERS_DUCK';
const FETCHING_USERS_DUCKS = 'FETCHING_USERS_DUCKS';
const FETCHING_USERS_DUCKS_ERROR = 'FETCHING_USERS_DUCKS_ERROR';
const FETCHING_USERS_DUCKS_SUCCUSS = 'FETCHING_USERS_DUCKS_SUCCUSS';

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

function fetchingUsersDucksSuccess (username, duckIds, lastUpdated) {
    return {
        type: FETCHING_USERS_DUCKS_SUCCUSS,
        username,
        duckIds,
        lastUpdated,
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
    return function (dispatch) {
        dispatch(fetchingUsersDucks());

        fetchUsersDucks(username)
            .then((ducks) => dispatch(addMultipleDucks(ducks)))
            .then(({ducks}) => dispatch(
                fetchingUsersDucksSuccess(
                    username,
                    Object.keys(ducks).sort((a,b) => ducks[b].timestamp - ducks[a].timestamp),
                    Date.now()
                )
            ))
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
        case FETCHING_USERS_DUCKS_SUCCUSS :
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