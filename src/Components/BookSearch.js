import React, { useEffect, useRef, useState } from "react";
import kakaoSearch from "../api/axios";
import "../css/bookSearch.css";
import openBook from "../imgs/open-book.png";
import heartFalse from "../imgs/heart-false.png";
import heartTrue from "../imgs/heart-true.png";
import searchIcon from "../imgs/search-icon.png";
import book1 from "../imgs/book1.jfif";
import book2 from "../imgs/book2.jpg";
import book3 from "../imgs/book3.jpg";
import book4 from "../imgs/book4.jfif";
import book5 from "../imgs/book5.jfif";
import book6 from "../imgs/book6.jfif";
import book7 from "../imgs/book7.jfif";
import book8 from "../imgs/book8.jfif";
import book9 from "../imgs/book9.jfif";
import { useNavigate } from "react-router-dom";

const BookSearch = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  console.log(books)

  useEffect(() => {
    makeCloneList();
  }, []);

  const makeCloneList = () => {
    let slide = document.querySelector('.book-slider');
    let slides = document.querySelectorAll('.book-slider li');

    for (let i = 0; i < 9; i++) {
      let clone = slides[i].cloneNode(true);
      clone.classList.add('clone');
      slide.appendChild(clone);
    }
  }

  const enterKey = (e) => {
    if (e.keyCode === 13) {
      getBooks();
    }
  };

  const getBooks = async () => {
    try {
      const params = {
        query: search,
        size: 30,
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
          autoComplete="off"
        ></input>

        <button
          className="search-book"
          onClick={(e) => {
            e.preventDefault();
            getBooks();
          }}
        >
          <img src={searchIcon} alt="검색 아이콘" />
        </button>
      </form>

      {
        Array.isArray(books) && books.length === 0 ? (
          <div>
            <h2>원하는책을 검색하고 공유해보세요</h2>
            <div className="book-animation">
              <div className="color-left"></div>
              <ul className="book-slider animation">
                <li>
                  <div className="slide-item">
                    <img src={book3} alt="책 이미지" />
                  </div>
                </li>
                <li>
                  <div className="slide-item">
                    <img src={book2} alt="책 이미지" />
                  </div>
                </li>
                <li>
                  <div className="slide-item">
                    <img src={book1} alt="책 이미지" />
                  </div>
                </li>
                <li>
                  <div className="slide-item">
                    <img src={book4} alt="책 이미지" />
                  </div>
                </li>
                <li>
                  <div className="slide-item">
                    <img src={book5} alt="책 이미지" />
                  </div>
                </li>
                <li>
                  <div className="slide-item">
                    <img src={book6} alt="책 이미지" />
                  </div>
                </li>
                <li>
                  <div className="slide-item">
                    <img src={book7} alt="책 이미지" />
                  </div>
                </li>
                <li>
                  <div className="slide-item">
                    <img src={book8} alt="책 이미지" />
                  </div>
                </li>
                <li>
                  <div className="slide-item">
                    <img src={book9} alt="책 이미지" />
                  </div>
                </li>
              </ul>
              <div className="color-right"></div>
            </div>
          </div>
        ) : (
          <div className="contents">
            {books.map((books) => {
              return (
                <div className="contents-container" key={books.isbn}>
                  
                  <img id="book" src={books.thumbnail} alt="책 이미지" />
                  <img id="open-book" src={openBook} alt="책 자세히 보기 아이콘" onClick={() => {
                    navigate(`/bookdetail/${books.title}`);
                  }} />
                  <img
                    className="heart false"
                    id="heart"
                    src={heartFalse}
                    alt="좋아요 아이콘"
                  />
                  <div className="detail">
                    <p>{books.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )
      }
    </div>
  );
};

export default BookSearch;
