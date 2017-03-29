'use strict';

const AWS = require('aws-sdk');
const path = require('path');

/* == Globals == */
const esDomain = {
    region: 'us-east-1',
    endpoint: 'search-translaty-sdt77wmwvyrqmzgawr4cviowhq.us-east-1.es.amazonaws.com',
    index: 'myindex',
    doctype: 'mytype'
};
const endpoint = new AWS.Endpoint(esDomain.endpoint);
/*
 * The AWS credentials are picked up from the environment.
 * They belong to the IAM role assigned to the Lambda function.
 * Since the ES requests are signed using these credentials,
 * make sure to apply a policy that allows ES domain operations
 * to the role.
 */
const creds = new AWS.EnvironmentCredentials('AWS');

/*
 * Post the given document to Elasticsearch
 */
function postToES(doc, context) {
    const req = new AWS.HttpRequest(endpoint);

    req.method = 'POST';
    req.path = path.join('/', esDomain.index, esDomain.doctype);
    req.region = esDomain.region;
    req.headers['presigned-expires'] = false;
    req.headers['Host'] = endpoint.host;
    req.body = doc;

    const signer = new AWS.Signers.V4(req, 'es');  // es: service code
    signer.addAuthorization(creds, new Date());

    const send = new AWS.NodeHttpClient();
    send.handleRequest(req, null, function(httpResp) {
        let respBody = '';
        httpResp.on('data', function (chunk) {
            respBody += chunk;
        });
        httpResp.on('end', function (chunk) {
            console.log('Response: ' + respBody);
            context.succeed('Lambda added document ' + doc);
        });
    }, function(err) {
        console.log('Error: ' + err);
        context.fail('Lambda failed with error ' + err);
    });
}

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    event.Records.forEach((record) => {
        postToES(JSON.stringify(record.dynamodb.NewImage, null, 2), context);
    });
    callback(null, `Successfully processed ${event.Records.length} records.`);
};