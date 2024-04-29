import "./css/reset.css";
import React, { useEffect, useState } from "react";
import { Routes, Route } from 'react-router-dom';
import kakaoSearch from "./api/axios";
import { database } from './firebase';
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import Home from './Components/Home';
import Main from './Components/Main';
import Layout from './Components/Layout';
import Login from "./Components/Login";
import Signup from "./Components/Signup";

function App() {

  const [books, setBooks] = useState([]);

  // useEffect(() => {
  //   getBooks();
  // }, []);

  // const getBooks = async () => {
  //   try {
  //     const params = {
  //       query : "블루",
  //       size : 10,
  //       target : "title"
  //     };
  //     const result = await kakaoSearch(params);
  //     setBooks(result.data.documents);

  //     console.log(result);
  //   } catch(error) {
  //     console.log(error);
  //   }
  // }

  // 유저 생성
  const user = async () => {
    try {
      const docRef = await addDoc(collection(database, "users"), {
        name: "J",
        id : Date.now()
      });
      console.log("생성", docRef);
    } catch(error) {
      console.log(error);
    }
  }

  // 유저 가져오기
  const getUsers = async () => {
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

    {/* {
      books.map((books) => {
        return <div className='contents-container' key={books.id}>
          <p>{books.title}</p>
          <img src={books.thumbnail} alt='책 이미지' />
        </div>
      })
    } */}

    <Routes>
      <Route path='/' element={<Layout />}>
      <Route index element={<Main />} />
      <Route path='/Home' element={<Home />} />
      </Route>
      <Route path="/login" element={<Login />}/>
      <Route path="/signup" element={<Signup />}/>
    </Routes>

    </div>
  );
}

export default App;
