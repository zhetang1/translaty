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

export function postReply (questionId, replyId, {name, timestamp, text}, ddbDocClient) {
    const params = {
        TableName: 'reply',
        Item:{
            'questionId': questionId,
            'username_timestamp': replyId,
            'text': text,
            'user': name,
            'timestamp': timestamp,
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
        Key: { 'username_timestamp': questionId }
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