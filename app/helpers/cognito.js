import AWS from 'aws-sdk';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser,
    AuthenticationDetails } from 'amazon-cognito-identity-js';

const region = 'us-east-1';
const ddbEndpoint = 'dynamodb.'.concat(region).concat('.amazonaws.com');
const identityPoolId = region.concat(':68685362-9240-40eb-81c5-89fa03df2bc4');

const userPool = new CognitoUserPool({
    UserPoolId: 'us-east-1_SkRxE85kt',
    ClientId: '27b4ip5flrt528fjc4cjk86a57',
});

export function signUp(email, username, pw) {
    const attributeList = [];

    const dataEmail = {
        Name: 'email',
        Value: email
    };

    const attributeEmail = new CognitoUserAttribute(dataEmail);

    attributeList.push(attributeEmail);

    return new Promise(function (resolve, reject) {
        userPool.signUp(username, pw, attributeList, null, function(err, data){
            if(err !== null) return reject(err);
            resolve(data)
        })
    });
}

export function confirmRegistration(username, confirmationCode) {
    const userData = {
        Username: username,
        Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);

    return new Promise(function (resolve, reject) {
        cognitoUser.confirmRegistration(confirmationCode, true, function(err, data) {
            if(err !== null) return reject(err);
            resolve(data)
        })
    });
}

export function authenticateUser(username, password) {
    const userData = {
        Username: username,
        Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);

    const authenticationDetails = new AuthenticationDetails({
        Username: username,
        Password: password,
    });

    return new Promise(function (resolve, reject) {
        cognitoUser.authenticateUser(authenticationDetails, {onSuccess: resolve, onFailure: reject,})
    });
}

export function retrievingCurrentUserFromLocalStorage() {
    const cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
        return new Promise(function (resolve, reject) {
            cognitoUser.getSession(function(err, session) {
                if(err !== null) return reject(err);
                resolve(session)
            })
        });
    }
    else {
        return new Promise(function (resolve) {
            resolve();
        })
    }
}

export function retrievingCurrentUserNameFromLocalStorage() {
    return userPool.getCurrentUser().getUsername();
}

export function createDdbDocClient(authenticateResult) {
    AWS.config.region = region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: identityPoolId,
        Logins : {'cognito-idp.us-east-1.amazonaws.com/us-east-1_SkRxE85kt':
            authenticateResult.getIdToken().getJwtToken()},
    });

    return new AWS.DynamoDB.DocumentClient();
}

export function logout () {
    let cognitoUser = userPool.getCurrentUser();
    if(cognitoUser != null) cognitoUser.signOut();
}