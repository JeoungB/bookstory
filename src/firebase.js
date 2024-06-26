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

// 로그인 유저
export const currentUser = () => {
  onAuthStateChanged(auth, (user) => {
    console.log(user);
  })
};

// 책 좋아요
export const likeBookHandler = async (state, click, bookData, userEmail) => {
  try{
    const books = await query(collection(database, "users"), where("email", "==", `${userEmail}`));
    const emailUser = await getDocs(books);
    emailUser.forEach((user) => {
      const getDatas = user.data().likeBook;
      const data = doc(database, "users", user.id);

      const sameData = getDatas.find((getData) => {
        return getData.isbn === click;
      })

      if(state === true) {
        updateDoc(data, {
          likeBook: arrayUnion(bookData)
        });
      }

      if(state === false) {
        updateDoc(data, {
          likeBook : arrayRemove(sameData)
        });
      }

    })
  } catch (error) {
    console.log("가져오기 실패", error);
  }
}
