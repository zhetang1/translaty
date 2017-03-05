import firebase from 'firebase'

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

export const usersDucksExpirationLength = 100000;
export const userExpirationLength = 100000;
export const repliesExpirationLength = 300000;