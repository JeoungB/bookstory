// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { collection, getDocs, getFirestore, query, where, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useSelector } from "react-redux";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
export const database = getFirestore(app);

// 회원가입
export const singup = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// 로그인
export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// 로그아웃
export const logout = () => {
  return signOut(auth)
    .then(() => {
      alert("로그아웃 되었습니다.");
    })
    .catch((error) => console.log(error));
};

export const currentUser = () => {
  onAuthStateChanged(auth, (user) => {
    console.log(user);
  })
};

export const likebook = async (state, userEmail, book) => {
  try {
    const user = await query(collection(database, "users"), where("email", "==", `${userEmail}`));
    const emailUser = await getDocs(user);
    emailUser.forEach((user) => {
      const data = doc(database, "users", user.id);

      console.log(book)

      if (state === false) {
        updateDoc(data, {
          likeBook: arrayUnion(...book)
        });
      }

      if (state === true) {
        updateDoc(data, {
          likeBook: arrayRemove(...book)
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};
