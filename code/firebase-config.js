// Firebase V9 Compat Initialization
// Strict Silent Client Mandate: Do not add console.log or error logging.

const firebaseConfig = {
  apiKey: "AIzaSyDKlPQqyGelXEgEQqADZDSgrRdYi_90CRQ",
  authDomain: "conformity-experiment.firebaseapp.com",
  projectId: "conformity-experiment",
  storageBucket: "conformity-experiment.firebasestorage.app",
  messagingSenderId: "197222848320",
  appId: "1:197222848320:web:0afaeb8953330c11cbcca5"
};

// Defensive execution to prevent UI thread blocking if the CDN fails to load
if (typeof firebase !== 'undefined') {
    try {
        // Prevent fatal error if the browser aggressively reloads the script
        if (typeof firebase.initializeApp === 'function' && (!firebase.apps || firebase.apps.length === 0)) {
            firebase.initializeApp(firebaseConfig);
        }
    } catch (e) {
        // Absolute silence mandated. No console.error here.
        // The failure will be naturally caught by experiment.js falling back to localStorage.
    }
}
