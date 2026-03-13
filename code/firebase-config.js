// Firebase V9 Compat Initialization
// Strict Silent Client Mandate: Do not add console.log or error logging.

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Defensive execution to prevent UI thread blocking if the CDN fails to load
if (typeof firebase !== 'undefined') {
    try {
        firebase.initializeApp(firebaseConfig);
    } catch (e) {
        // Absolute silence mandated. No console.error here.
        // The failure will be naturally caught by experiment.js falling back to localStorage.
    }
}
