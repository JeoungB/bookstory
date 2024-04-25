// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBBLyPM3pZORcDgsIAbZXSZXaEgAGo6eWE",
  authDomain: "bookstory-b5488.firebaseapp.com",
  projectId: "bookstory-b5488",
  storageBucket: "bookstory-b5488.appspot.com",
  messagingSenderId: "347391670852",
  appId: "1:347391670852:web:09234d884842879553da11",
  measurementId: "G-F8QZ38L67R"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

// 회원가입
export const singup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
}

// 로그인
export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
}

// 로그아웃
export const logout = () => {
  return signOut(auth).then(() => alert("로그아웃 되었습니다.")).catch((error) => console.log(error));
}

export const currentUser = () => {
  console.log(auth.currentUser);
}
