import { addListener } from 'redux/modules/listeners'
import { listenToFeed } from 'helpers/ddb'
import { createQuestionsFromDdbResponse } from 'helpers/utils'
import { addMultipleQuestions } from 'redux/modules/questions'
import { fromJS } from 'immutable'

const SETTING_FEED_LISTENER = 'SETTING_FEED_LISTENER';
const SETTING_FEED_LISTENER_ERROR = 'SETTING_FEED_LISTENER_ERROR';
const SETTING_FEED_LISTENER_SUCCESS = 'SETTING_FEED_LISTENER_SUCCESS';
const ADD_NEW_DUCK_ID_TO_FEED = 'ADD_NEW_DUCK_ID_TO_FEED';
const RESET_NEW_DUCKS_AVAILABLE = 'RESET_NEW_DUCKS_AVAILABLE';

function settingFeedListener () {
    return {
        type: SETTING_FEED_LISTENER,
    }
}

function settingFeedListenerError (error) {
    console.warn(error);
    return {
        type: SETTING_FEED_LISTENER_ERROR,
        error: 'Error fetching feeds.',
    }
}

function settingFeedListenerSuccess (questionIds) {
    return {
        type: SETTING_FEED_LISTENER_SUCCESS,
        questionIds,
    }
}

function addNewDuckIdToFeed (questionId) {
    return {
        type: ADD_NEW_DUCK_ID_TO_FEED,
        questionId,
    }
}

export function resetNewDucksAvailable () {
    return {
        type: RESET_NEW_DUCKS_AVAILABLE,
    }
}

export function setAndHandleFeedListener () {
    let initialFetch = true;
    return function (dispatch, getState) {
        const state = getState();
        if (state.listeners.feed === true) {
            return
        }

        dispatch(addListener('feed'));
        dispatch(settingFeedListener());

        listenToFeed(state.users.ddbDocClient)
            .then((response) => {
            const {map, sortedIds} = createQuestionsFromDdbResponse(response);
            dispatch(addMultipleQuestions(map));
            initialFetch === true
                ? dispatch(settingFeedListenerSuccess(sortedIds))
                : dispatch(addNewDuckIdToFeed(sortedIds[0]));
            initialFetch = false
        })
            .catch((error) => dispatch(settingFeedListenerError(error)))
    }
}

const initialState = fromJS({
    isFetching: false,
    newQuestionsAvailable: false,
    newDucksToAdd: [],
    error: '',
    questionIds: [],
});

export default function feed (state = initialState, action) {
    switch (action.type) {
        case SETTING_FEED_LISTENER :
            return state.merge({
                isFetching: true,
            });
        case SETTING_FEED_LISTENER_ERROR :
            return state.merge({
                isFetching: false,
                error: action.error,
            });
        case SETTING_FEED_LISTENER_SUCCESS :
            return state.merge({
                isFetching: false,
                error: '',
                questionIds: action.questionIds,
                newQuestionsAvailable: false,
            });
        case ADD_NEW_DUCK_ID_TO_FEED :
            return state.merge({
                newDucksToAdd: state.get('newDucksToAdd').unshift(action.questionId),
            });
        case RESET_NEW_DUCKS_AVAILABLE :
            return state.merge({
                questionIds: state.get('newDucksToAdd').concat(state.get('questionIds')),
                newDucksToAdd: [],
                newQuestionsAvailable: false,
            });
        default :
            return state
    }
}