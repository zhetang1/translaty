import AWS from 'aws-sdk';
import { CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { region, identityPoolId, userPool } from 'config/constants'
import { clearAwsConfig } from 'helpers/ddb'

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

export function resendConfirmationCode(username) {
    const userData = {
        Username: username,
        Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);

    return new Promise(function (resolve, reject) {
        cognitoUser.resendConfirmationCode(function(err, data) {
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
    clearAwsConfig();
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
    AWS.config.credentials.clearCachedId();
}