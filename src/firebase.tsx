// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANe6FhYgb8cKaPQSlDiV-VpPI-TVmdgwc",
  authDomain: "crucial-binder-166413.firebaseapp.com",
  projectId: "crucial-binder-166413",
  storageBucket: "crucial-binder-166413.appspot.com",
  messagingSenderId: "251134816734",
  appId: "1:251134816734:web:a4ee50fbcb52d6c0176d4f",
  measurementId: "G-DFQWV78HE0",
};
// Initialize Firebase

export const app = initializeApp(firebaseConfig);
// Export firestore database
// It will be imported into your react app whenever it is needed
export const db = getFirestore(app);
export const storage = getStorage(app);
export const docRef = collection(db, "documents");
