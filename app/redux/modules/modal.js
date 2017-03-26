const OPEN_MODAL = 'OPEN_MODAL';
const CLOSE_MODAL = 'CLOSE_MODAL';
const UPDATE_DUCK_TEXT = 'UPDATE_DUCK_TEXT';

export function openModal () {
    return {
        type: OPEN_MODAL,
    }
}

export function closeModal () {
    return {
        type: CLOSE_MODAL,
    }
}

export function updateDuckText (newDuckText) {
    return {
        type: UPDATE_DUCK_TEXT,
        newDuckText,
    }
}

const initialState = {
    questionText: '',
    isOpen: false,
};

export default function modal (state = initialState, action) {
    switch (action.type) {
        case OPEN_MODAL :
            return {
                ...state,
                isOpen: true,
            };
        case CLOSE_MODAL :
            return {
                ...state,
                questionText: '',
                isOpen: false,
            };
        case UPDATE_DUCK_TEXT :
            return {
                ...state,
                questionText: action.newDuckText,
            };
        default :
            return state
    }
}
