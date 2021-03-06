import { region } from 'config/constants'

export function saveQuestion (questionId, {name, timestamp, text}, ddbDocClient) {
    const params = {
        TableName: 'question',
        Item:{
            'username_timestamp': questionId,
            'text': text,
            'user': name,
            'timestamp': timestamp,
            'likeCount': 0,
        }
    };

    return new Promise(function (resolve, reject) {
        ddbDocClient.put(params, function(err, data) {
            if(err !== null) return reject(err);
            resolve(data)
        })
    });
}

export function postReply (questionId, replyId, reply, ddbDocClient) {
    const params = {
        TableName: 'reply',
        Item:{
            'questionId': questionId,
            'username_timestamp': replyId,
            'text': reply.reply,
            'user': reply.authedId,
            'timestamp': reply.timestamp,
        }
    };

    const replyWithId = {...reply, replyId};

    const replyPromise = new Promise(function (resolve, reject) {
        ddbDocClient.put(params, function(err, data) {
            if(err !== null) return reject(err);
            resolve(data)
        })
    });

    return {
        replyWithId,
        replyPromise,
    }
}

export function saveToUsersLikes (user, questionId, ddbDocClient) {
    const params = {
        TableName: 'likedQuestions',
        Item:{
            'questionId': questionId,
            'user': user,
            'timestamp': Date.now(),
        }
    };

    return new Promise(function (resolve, reject) {
        ddbDocClient.put(params, function(err, data) {
            if(err !== null) return reject(err);
            resolve(data)
        })
    });
}

export function deleteFromUsersLikes (user, questionId, ddbDocClient) {
    const params = {
        TableName: 'likedQuestions',
        Key:{
            'questionId': questionId,
            'user': user,
        }
    };

    return new Promise(function (resolve, reject) {
        ddbDocClient.delete(params, function(err, data) {
            if(err !== null) return reject(err);
            resolve(data)
        })
    });
}

export function incrementNumberOfLikes (questionId, ddbDocClient) {
    return updateNumberOfLikes(questionId, ddbDocClient, 1);
}

export function decrementNumberOfLikes (questionId, ddbDocClient) {
    return updateNumberOfLikes(questionId, ddbDocClient, -1);
}

function updateNumberOfLikes (questionId, ddbDocClient, increment) {
    const params = {
        TableName : 'question',
        Key: { 'username_timestamp': questionId },
        UpdateExpression: 'set likeCount = likeCount + :num',
        ExpressionAttributeValues: {':num': increment},
    };

    return new Promise(function (resolve, reject) {
        ddbDocClient.update(params, function (err, data) {
            if(err !== null) return reject(err);
            resolve(data);
        })
    });
}

export function listenToFeed (ddbDocClient) {
    const params = {
        TableName: 'question',
    };

    return new Promise(function (resolve, reject) {
        ddbDocClient.scan(params, function (err, data) {
            if(err !== null) return reject(err);
            resolve(data);
        })
    });
}

export function fetchQuestion (questionId, ddbDocClient) {
    const params = {
        TableName : 'question',
        Key: { 'username_timestamp': questionId },
    };

    return new Promise(function (resolve, reject) {
        ddbDocClient.get(params, function (err, data) {
            if(err !== null) return reject(err);
            resolve(data);
        })
    });
}

export function fetchReplies (questionId, ddbDocClient) {
    const params = {
        TableName : 'reply',
        KeyConditionExpression: "#questionId = :questionId",
        ExpressionAttributeNames:{
            "#questionId": "questionId"
        },
        ExpressionAttributeValues: {
            ":questionId": questionId
        }
    };

    return new Promise(function (resolve, reject) {
        ddbDocClient.query(params, function (err, data) {
            if(err !== null) return reject(err);
            resolve(data);
        })
    });
}

export function fetchUsersQuestions (user, ddbDocClient) {
    const params = {
        TableName : 'question',
        IndexName: 'user-timestamp-index',
        KeyConditionExpression: "#user = :user",
        ExpressionAttributeNames:{
            "#user": "user"
        },
        ExpressionAttributeValues: {
            ":user": user
        },
        ScanIndexForward: false,
    };

    return new Promise(function (resolve, reject) {
        ddbDocClient.query(params, function (err, data) {
            if(err !== null) return reject(err);
            resolve(data);
        })
    });
}

export function fetchUsersLikes (user, ddbDocClient) {
    const params = {
        TableName : 'likedQuestions',
        IndexName: 'user-index',
        KeyConditionExpression: "#user = :user",
        ExpressionAttributeNames:{
            "#user": "user"
        },
        ExpressionAttributeValues: {
            ":user": user
        },
    };

    return new Promise(function (resolve, reject) {
        ddbDocClient.query(params, function (err, data) {
            if(err !== null) return reject(err);
            resolve(data);
        })
    });
}

export function createReadOnlyDdbDocClient() {
    clearAwsConfig();
    AWS.config.region = region;
    AWS.config.accessKeyId = 'AKIAJSUOBVCZIJHPQBUA';
    AWS.config.secretAccessKey = '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';
    return new AWS.DynamoDB.DocumentClient();
}

export function clearAwsConfig() {
    AWS.config.accessKeyId = null;
    AWS.config.secretAccessKey = null;
    AWS.config.credentials = null;
}