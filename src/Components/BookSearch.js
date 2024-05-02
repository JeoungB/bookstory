import React, { useEffect, useRef, useState } from "react";
import kakaoSearch from "../api/axios";
import "../css/bookSearch.css";
import openBook from "../imgs/open-book.png";
import heartFalse from "../imgs/heart-false.png";
import heartTrue from "../imgs/heart-true.png";

const BookSearch = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  console.log(books);

  const enterKey = (e) => {
    if (e.keyCode === 13) {
      getBooks();
    }
  };

  const getBooks = async () => {
    try {
      const params = {
        query: search,
        size: 10,
        target: "title",
      };
      const result = await kakaoSearch(params);
      const searchDatas = result.data.documents;
      const searchData = searchDatas.filter((searchDatas) => {
        return searchDatas.thumbnail !== "";
      });
      setBooks(searchData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bookSearch">
      <form className="search-form">
        <input
          type="text"
          id="book-search_input"
          placeholder="책 이름을 검색하세요"
          onChange={(e) => {
            e.preventDefault();
            setSearch(e.target.value);
          }}
          onKeyDown={(e) => enterKey(e)}
        ></input>

        <button
          className="search-book"
          onClick={(e) => {
            e.preventDefault();
            getBooks();
          }}
        >
          찾기
        </button>
      </form>

      <h2>원하는 책을 검색하고 공유해보세요</h2>

      <div className="book-animation">
        <div className="color-left"></div>
        <ul className="book-slider animation">
          <li>
            <div className="slide-item">1</div>
          </li>
          <li>
            <div className="slide-item">2</div>
          </li>
          <li>
            <div className="slide-item">3</div>
          </li>
          <li>
            <div className="slide-item">4</div>
          </li>
          <li>
            <div className="slide-item">5</div>
          </li>
          <li>
            <div className="slide-item">6</div>
          </li>
          <li>
            <div className="slide-item">7</div>
          </li>
          <li>
            <div className="slide-item">8</div>
          </li>
          <li>
            <div className="slide-item">9</div>
          </li>
        </ul>
        <div className="color-right"></div>
      </div>

      <div className="contents">
        {books.map((books) => {
          return (
            <div className="contents-container" key={books.isbn}>
              <img id="book" src={books.thumbnail} alt="책 이미지" />
              {/* <p>{books.title}</p> */}
              <img id="open-book" src={openBook} alt="책 자세히 보기 아이콘" />
              <img
                className="heart false"
                id="heart"
                src={heartFalse}
                alt="좋아요 아이콘"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookSearch;
