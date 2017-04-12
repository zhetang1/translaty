import Elasticsearch from 'aws-es';

const elasticsearch = new Elasticsearch({
    accessKeyId: 'AKIAJ7CNS6RP6DJHZQMA',
    secretAccessKey: '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',
    service: 'es',
    region: 'us-east-1',
    host: 'search-translaty-sdt77wmwvyrqmzgawr4cviowhq.us-east-1.es.amazonaws.com'
});

export function search(phrase) {
    return new Promise(function (resolve, reject) {
        elasticsearch.search(
            {
                index: 'myindex',
                type: 'mytype',
                body: {
                    query: {
                        "match": {
                            "text.S": 'q'
                        }
                    }
                }
            },
            function(err, data) {
            if(err !== null) return reject(err);
            resolve(data)
        })
    });
}