import React, { useEffect, useState, useLayoutEffect } from "react";
import kakaoSearch from "../api/axios";
import "../css/bookSearch.css";
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
import { useSelector, useDispatch } from "react-redux";
import { database } from "../firebase";
import { addLikeBook, removeLikeBook, removeLikeBooks, searchBookData } from "../store";
import { likeBookHandler } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

// 책 등장할 때 밑에서 위로 스르륵 보여지게 만들기
// book search 클릭해서 이동 시 리덕스에 검색한 책 정보 데이터 초기화

const BookSearch = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const likeBooks = useSelector((state) => state.likeBook);
  const userEmail = useSelector((state) => state.user);
  const searchBook = useSelector((state) => state.searchBook);

  useEffect(() => {
    if (searchBook.length === 0) {
      makeCloneList();
    }
  }, []);

  useEffect(() => {
    likeBookRedux();
  }, []);

  // 좋아요 목록 가져오기 fireBase 연동
  const likeBookRedux = async () => {
    try {
      const user = await query(
        collection(database, "users"),
        where("email", "==", `${userEmail}`)
      );
      const emailUser = await getDocs(user);
      emailUser.forEach((user) => {
        for (let i = 0; i < user.data().likeBook.length; i++) {
          dispatch(addLikeBook(user.data().likeBook[i].isbn));
        }
      });
    } catch (error) {
      console.log("로그인한 유저의 좋아요 책 정보 가져오기 실패", error);
    }
  };

  // 슬라이드 클론 함수
  const makeCloneList = () => {
    let slide = document.querySelector(".book-slider");
    let slides = document.querySelectorAll(".book-slider li");

    for (let i = 0; i < 9; i++) {
      let clone = slides[i].cloneNode(true);
      clone.classList.add("clone");
      slide.appendChild(clone);
    }
  };

  // 검색 엔터 함수
  const enterKey = (e) => {
    if (e.keyCode === 13 && search) {
      getBooks();
    }
  };

  // 책 검색 함수 30개 ( 카카오 API )
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

      // 카카오 책 목록중 고유 아이디가 중복인 경우 map 오류 수정.
      // isbn이 중복인 isbn찾기
      let dataIsbn = [];
      for(let i = 0 ; i < searchData.length ; i++) {
        for(let v = 1 ; v < searchData.length ; v++) {
          if(searchData[i].isbn === searchData[v].isbn) {
            dataIsbn.push(searchData[i].isbn);
          }
        }
      }
      let sameIsbn = [...new Set(dataIsbn.filter((item, index) => 
        dataIsbn.indexOf(item) !== index
      ))];

      // 중복인 isbn은 거르기
      const datas = searchData.filter((data) => {
        for(let i = 0 ; i < sameIsbn.length ; i++) {
          return data.isbn !== sameIsbn[i]
        }
      });

      if(datas.length !== 0) {
        dispatch(searchBookData([...datas]));
      }

      if(datas.length === 0) {
        dispatch(searchBookData(searchData));
      }
    } catch (error) {
      console.log("검색한 책 정보 가져오기 실패", error);
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
            if(search) {
              getBooks();
            }
          }}
        >
          <img src={searchIcon} alt="검색 아이콘" />
        </button>
      </form>

      {searchBook.length !== 0 ? (
        <div className="contents">
          {searchBook.map((books) => {
            return (
              <div className="contents-container" key={books.isbn}>
                <div className="pointer">
                  <div className="line"></div>
                </div>
                <img id="book" src={books.thumbnail} alt="책 이미지" onClick={() => {
                  navigate(`/bookdetail/${books.title}`);
                }} />

                {likeBooks.includes(books.isbn) ? (
                  <img
                    className="heart red"
                    id="heart"
                    src={heartTrue}
                    alt="좋아요 아이콘"
                    onClick={() => {
                        likeBookHandler(false, books.isbn, books, userEmail);
                        dispatch(removeLikeBook(books.isbn));
                        dispatch(removeLikeBooks(books));
                    }}
                  />
                ) : (
                  <img
                    className="heart false"
                    id="heart"
                    src={heartFalse}
                    alt="좋아요 아이콘"
                    onClick={() => {
                      if(userEmail) {
                        likeBookHandler(true, books.isbn, books, userEmail);
                        dispatch(addLikeBook(books.isbn));
                      }

                      if(!userEmail) {
                        alert("로그인이 필요합니다.");
                      }
                    }}
                  />
                )}

              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <h2>원하는책을 검색하고 공유해보세요</h2>
          <div className="book-animation">
            <div className="color-left"></div>
            <ul className="book-slider move-slide_animation">
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
      )}
    </div>
  );
};

export default BookSearch;
