import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCgPpH5Fzdoz8ACxKwEgalNJkXv4oWJa8k",
    authDomain: "stocks-4da6a.firebaseapp.com",
    databaseURL: "https://stocks-4da6a.firebaseio.com",
    storageBucket: "stocks-4da6a.appspot.com",
};

export const firebaseApp = firebase.initializeApp(config);

export function getLocalUserId() {
    let uid;

    //this key exists if the user is logged in, when logged out is removed
    //the user should be authoraized when seeing the dashboard
    //use it to avoid waiting for firebaseApp.auth().onAuthStateChanged
    for (let key in localStorage) {
        if (key.startsWith('firebase:authUser:')) {
            uid = JSON.parse(localStorage.getItem(key)).uid;
            break;
        }
    }

    return uid;
}
