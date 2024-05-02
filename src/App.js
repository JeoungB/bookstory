import "./css/reset.css";
import React from "react";
import { Routes, Route } from 'react-router-dom';
import { database } from './firebase';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import Home from './Components/Home';
import Main from './Components/Main';
import Layout from './Components/Layout';
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import BookSearch from "./Components/BookSearch";


// 이미지 출저.
// <a href="https://www.flaticon.com/kr/free-icons/" title="별 아이콘">별 아이콘  제작자: rizky adhitya pradana - Flaticon</a>

function App() { 

  // 모든 유저 정보 가져오기
  const getUser = async () => {
    try{
      const users = await getDocs(collection(database, "users"));
      users.forEach((user) => {
        console.log("유저 데이터", user.data());
        console.log("유저 고유 ID", user.id);
      })
    }catch(error) {
      console.log(error);
    }
  };

  // 특정 유저 가져오기
  const getKeyUser = async () => {
    try{
      const user = await query(collection(database, "users"), where("name", "==", "J"));
      const emailUser = await getDocs(user);
      emailUser.forEach((user) => {
        console.log(user.data());
      })
    } catch(error) {
      console.log(error);
    }
  }

  // 데이터 수정하기
  const update = async () => {
    try{
      const user = await query(collection(database, "users"), where("name", "==", "J"));
      const emailUser = await getDocs(user);
      emailUser.forEach((user) => {
        console.log(user.id);
        const data = doc(database, "users", user.id);
        
        updateDoc(data, {
          name : "dsds"
        });
      })
    }catch(error) {
      console.log(error);
    }
  }

  return (
    <div className="App">

    <Routes>
      <Route path='/' element={<Layout />}>
      <Route index element={<Main />} />
      <Route path='/Home' element={<Home />} />
      <Route path="/booksearch" element={<BookSearch />}/>
      </Route>
      <Route path="/login" element={<Login />}/>
      <Route path="/signup" element={<Signup />}/>
    </Routes>

    </div>
  );
}

export default App;
