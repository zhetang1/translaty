import firebase from 'firebase'
import AWS from 'aws-sdk';
import { CognitoUserPool } from 'amazon-cognito-identity-js';

const config = {
    apiKey: "AIzaSyCBjLOt6zWXQgENtynrAepKfp9dq-jtsVY",
    authDomain: "tangzhe-translaty-project.firebaseapp.com",
    databaseURL: "https://tangzhe-translaty-project.firebaseio.com",
    storageBucket: "tangzhe-translaty-project.appspot.com",
    messagingSenderId: "719798162662"
};

firebase.initializeApp(config);

export const ref = firebase.database().ref();
export const firebaseAuth = firebase.auth;

export const usersQuestionsExpirationLength = 100000;
export const userExpirationLength = 100000;
export const repliesExpirationLength = 300000;

export const region = 'us-east-1';
export const identityPoolId = region.concat(':68685362-9240-40eb-81c5-89fa03df2bc4');

export const userPool = new CognitoUserPool({
    UserPoolId: 'us-east-1_SkRxE85kt',
    ClientId: '27b4ip5flrt528fjc4cjk86a57',
});