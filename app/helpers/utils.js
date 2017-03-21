import { usersDucksExpirationLength, userExpirationLength, repliesExpirationLength } from 'config/constants'

export function formatUserInfoFromFireBase (name, avatar, uid) {
    return {
        name,
        avatar,
        uid,
    }
}

export function formatUserInfo (name) {
    return {
        name,
    }
}

export function formatDuck (text, {name}) {
    return {
        text,
        name,
        timestamp: Date.now()
    }
}

export function formatTimestamp (timestamp) {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}

function getMilliseconds (timestamp) {
    return new Date().getTime() - new Date(timestamp).getTime()
}

export function staleUser (timestamp) {
    return getMilliseconds(timestamp) > usersDucksExpirationLength
}

export function staleDucks (timestamp) {
    return getMilliseconds(timestamp) > userExpirationLength
}

export function staleReplies (timestamp) {
    return getMilliseconds(timestamp) > repliesExpirationLength
}

export function formatReply(username, reply) {
    return {
        reply,
        username,
        timestamp: Date.now()
    }
}

export function checkIfAuthed (store) {
    return store.getState().users.isAuthed === true
}

export function createQuestionsFromDdbResponse (response) {
    const questions = response.Items.sort((a, b) => {
        return b.timestamp - a.timestamp
    });
    const map = {};
    const sortedIds = [];
    questions.forEach( (x) => {
        const id = x.username_timestamp;
        map[id] = x;
        sortedIds.push(id);
    });

    return {map, sortedIds}
}