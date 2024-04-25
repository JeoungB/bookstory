import './App.css';
import React, { useEffect, useState } from "react";
import kakaoSearch from "./api/axios";
import Singup from './Components/Signup';

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

  return (
    <div className="App">
      도서 검색 어플

    {/* {
      books.map((books) => {
        return <div className='contents-container' key={books.id}>
          <p>{books.title}</p>
          <img src={books.thumbnail} alt='책 이미지' />
        </div>
      })
    } */}

    <Singup />

    </div>
  );
}

export default App;
