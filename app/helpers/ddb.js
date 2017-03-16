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